// app.json holds the app's settings; this adds the one that comes from the
// environment: Google sign-in's iOS URL scheme, which is the iOS client ID
// reversed (com.googleusercontent.apps.<id>). Set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
// in mobile/.env.local and in Expo's build settings (eas env).
module.exports = ({ config }) => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (!iosClientId) return config;
  const iosUrlScheme = `com.googleusercontent.apps.${iosClientId.replace(/\.apps\.googleusercontent\.com$/, '')}`;
  return {
    ...config,
    plugins: [...(config.plugins ?? []), ['@react-native-google-signin/google-signin', { iosUrlScheme }]],
  };
};
