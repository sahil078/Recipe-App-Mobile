import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import {favoritesStyles} from "../../assets/styles/favorites.styles"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import NoFavoritesFound from '../../components/NoFavoritesFound'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { API_URL } from '../../constants/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RecipeCard from '../../components/RecipeCard'

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.userFavorites) {
          const transformedFavorites = result.userFavorites.map((favorite) => ({
            ...favorite,
            id: favorite.recipeId,
          }));
          setFavoriteRecipes(transformedFavorites);
        } else {
          setFavoriteRecipes([]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        Alert.alert("Error", "Failed to load favorites");
        setFavoriteRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Call the signOut function outside the Alert
            performSignOut();
          },
        },
      ]);
    } catch (error) {
      console.error("Error in handleSignOut:", error);
    }
  };

  const performSignOut = async () => {
    try {
      await signOut(); // Ensure signOut is awaited
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your favorites ..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;