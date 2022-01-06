import { Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MainButton = ({ options }) => {
    const {
        gradientColors,
        gradientStyle,
        buttonStyle,
        onPress,
        buttonText,
        buttonTextStyle
    } = options;

    return (
        <LinearGradient
            colors={gradientColors}
            style={gradientStyle}
        >
            <TouchableOpacity
                style={buttonStyle}
                onPress={onPress}>
                <Text style={buttonTextStyle}>{buttonText}</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

export default MainButton;