import { Children } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ Children }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor:Colors.background }}>
            {Children}
        </View>
    );
}