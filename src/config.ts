import { Platform } from "react-native";

// On the Android emulator, 10.0.2.2 is an alias for the host machine's localhost.
// iOS simulator would use localhost directly.
const HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

// Must match the port in your backend's launchSettings.json.
export const API_BASE_URL = `http://${HOST}:5189/api`;