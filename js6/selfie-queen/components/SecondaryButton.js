import { TouchableOpacity, Text } from 'react-native';

const SecondaryButton = ({ options }) => {
    const { onPress, buttonStyle, buttonTextStyle, buttonText } = options;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
        </TouchableOpacity>
    )
}

export default SecondaryButton;