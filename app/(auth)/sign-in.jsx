import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Image} from "expo-image";
import {useSignIn} from "@clerk/clerk-expo";

const signInScreen = () => {
  const router = useRouter();

  const {signIn, setActive, isLoaded} = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hadleSignIn = async () => {
    if(!email || !password) {
      Alert.alert("Error , Please fill in all the fields");
      return;
    }

    if(!isLoaded) {
      return;
    }
    setLoading(true);

    try{
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if(signInAttempt.status === "complete" ) {
        await setActive({session: signInAttempt.createdSessionId});
      }else{
        Alert.alert("Error", "Sign in failed. Please try again");
        console.error(JSON.stringify(signInAttempt, null, 2));
      } 
    }catch(err){
      Alert.alert("Error", err.errors?.[0]?.message || "Sign In Failed");
      console.error(JSON.stringify(err, null, 2));
    } finally{ 
      setLoading(false);
    }
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="container"
            />
          </View>

          <Text style={authStyles.title}> Welcome Back </Text>

          {/* Form Contaienr */}
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Container */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={hadleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}> {loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            {/* SignUp Link */}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.push("/(auth)/sign-up")}
              >
                <Text style={authStyles.linkText}>
                  Don&apos;t have an account?
                </Text>
              </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default signInScreen;
