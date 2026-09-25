
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import {
  ResponseType,
  makeRedirectUri,
} from "expo-auth-session";
import { useAuthRequest as useGoogleAuthRequest } from "expo-auth-session/providers/google";
import { useAuthRequest as useFacebookAuthRequest } from "expo-auth-session/providers/facebook";

import {
  loginWithEmail,
  registerWithEmail,
  loginWithFacebook,
  loginWithGoogle,
} from "../services/authService";

import { styles } from "../styles";

// Complete OAuth browser session when returning to the app.
WebBrowser.maybeCompleteAuthSession();

type Props = {
  onAuthenticated: (name: string) => void;
};

/*
 * Google OAuth Client IDs
 *
 * WEB CLIENT ID:
 * Firebase / Google Cloud Console
 */
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  "417051803462-h875qvc9od81tq3s6ntugsh4qr6r1lcp.apps.googleusercontent.com";

/*
 * ANDROID CLIENT ID:
 *
 * IMPORTANT:
 * Replace this with the Android OAuth Client ID
 * from Firebase / Google Cloud Console.
 *
 * Do NOT use the Web Client ID here.
 */
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ??
  "417051803462-h875qvc9od81tq3s6ntugsh4qr6r1lcp.apps.googleusercontent.com";

export function AuthScreen({ onAuthenticated }: Props) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * =========================================================
   * FACEBOOK CONFIGURATION
   * =========================================================
   */

  const facebookAppId =
    process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? "";

  const [
    facebookRequest,
    ,
    promptFacebookAsync,
  ] = useFacebookAuthRequest({
    clientId:
      facebookAppId || "missing-facebook-app-id",

    responseType: ResponseType.Token,

    scopes: [
      "public_profile",
      "email",
    ],
  });

  /**
   * =========================================================
   * GOOGLE CONFIGURATION
   * =========================================================
   */

  const googleRedirectUri = makeRedirectUri({
    scheme: "studyroombooking",
    path: "redirect",
  });

  const [
    googleRequest,
    ,
    promptGoogleAsync,
  ] = useGoogleAuthRequest({
    /*
     * Web OAuth Client ID
     */
    webClientId:
      GOOGLE_WEB_CLIENT_ID,

    /*
     * Android OAuth Client ID
     *
     * Required because this app is running
     * as a native Android application.
     */
    androidClientId:
      GOOGLE_ANDROID_CLIENT_ID,

    responseType:
      ResponseType.IdToken,

    scopes: [
      "openid",
      "profile",
      "email",
    ],

    redirectUri:
      googleRedirectUri,

    selectAccount: true,
  });

  /**
   * =========================================================
   * EMAIL / PASSWORD AUTHENTICATION
   * =========================================================
   */

  const submit = async () => {
    setError("");
    setNotice("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    /*
     * Validate name when registering.
     */
    if (
      isRegistering &&
      cleanName.length < 2
    ) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    /*
     * Validate email.
     */
    if (!cleanEmail.includes("@")) {
      setError(
        "Enter a valid university email."
      );

      return;
    }

    /*
     * Validate password.
     */
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setIsLoading(true);

      /*
       * REGISTER
       */
      if (isRegistering) {
        const user =
          await registerWithEmail(
            cleanEmail,
            password,
            cleanName
          );

        console.log(
          "Firebase registration successful:"
        );

        console.log(
          "UID:",
          user.uid
        );

        console.log(
          "Email:",
          user.email
        );

        setName("");
        setEmail("");
        setPassword("");
        setIsRegistering(false);
        setNotice(
          "Account created successfully. Please sign in to continue."
        );

        return;
      }

      /*
       * LOGIN
       */
      const user =
        await loginWithEmail(
          cleanEmail,
          password
        );

      console.log(
        "Firebase login successful:"
      );

      console.log(
        "UID:",
        user.uid
      );

      console.log(
        "Email:",
        user.email
      );

      onAuthenticated(
        user.displayName ??
          user.email ??
          cleanEmail
      );
    } catch (error: any) {
      console.log(
        "Firebase Authentication error:",
        error
      );

      switch (error?.code) {
        case "auth/email-already-in-use":
          setError(
            "This email is already registered."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Invalid email address."
          );
          break;

        case "auth/weak-password":
          setError(
            "Password must be at least 6 characters."
          );
          break;

        case "auth/invalid-credential":
          setError(
            "Incorrect email or password."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account found with this email."
          );
          break;

        case "auth/wrong-password":
          setError(
            "Incorrect password."
          );
          break;

        case "auth/operation-not-allowed":
        case "auth/configuration-not-found":
          setError(
            "Firebase Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method."
          );
          break;

        default:
          setError(
            error?.message ||
              "Authentication failed. Please try again."
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * =========================================================
   * GOOGLE SIGN-IN
   * =========================================================
   */

  const handleGooglePress = async () => {
    /*
     * Check Google configuration.
     */
    if (
      GOOGLE_ANDROID_CLIENT_ID ===
      "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com"
    ) {
      setError(
        "Google Android Client ID is not configured yet."
      );

      return;
    }

    /*
     * Check OAuth request.
     */
    if (!googleRequest) {
      setError(
        "Google Sign-In is still loading. Please try again."
      );

      return;
    }

    try {
      setError("");
      setIsLoading(true);

      console.log(
        "========== GOOGLE LOGIN START =========="
      );

      console.log(
        "Google redirect URI:",
        googleRedirectUri
      );

      console.log(
        "Opening Google OAuth..."
      );

      const result =
        await promptGoogleAsync();

      console.log(
        "Google OAuth result:",
        result
      );

      /*
       * User cancelled.
       */
      if (
        result.type ===
        "cancel"
      ) {
        console.log(
          "User cancelled Google login."
        );

        return;
      }

      /*
       * OAuth did not succeed.
       */
      if (
        result.type !==
        "success"
      ) {
        console.log(
          "Google login did not succeed:",
          result
        );

        setError(
          "Google login was not completed."
        );

        return;
      }

      /*
       * With ResponseType.IdToken,
       * Google returns the ID token.
       */
      const idToken =
        result.params?.id_token;

      console.log(
        "Google ID token exists:",
        !!idToken
      );

      if (!idToken) {
        console.log(
          "Google did not return an ID token."
        );

        setError(
          "Google did not return an ID token."
        );

        return;
      }

      /*
       * Firebase Google authentication.
       */
      console.log(
        "Signing in to Firebase with Google..."
      );

      const user =
        await loginWithGoogle(
          idToken
        );

      console.log(
        "Google Firebase login successful!"
      );

      console.log(
        "UID:",
        user.uid
      );

      console.log(
        "Email:",
        user.email
      );

      console.log(
        "Display name:",
        user.displayName
      );

      onAuthenticated(
        user.displayName ??
          user.email ??
          "Google User"
      );
    } catch (error: any) {
      console.log(
        "========== GOOGLE ERROR =========="
      );

      console.log(
        "Full error:",
        error
      );

      console.log(
        "Error code:",
        error?.code
      );

      console.log(
        "Error message:",
        error?.message
      );

      console.log(
        "=================================="
      );

      if (
        error?.code ===
        "ERR_CANCELED"
      ) {
        return;
      }

      setError(
        error?.message
          ? `Google login failed: ${error.message}`
          : "Google login failed. Please try again."
      );
    } finally {
      setIsLoading(false);

      console.log(
        "========== GOOGLE LOGIN END =========="
      );
    }
  };

  /**
   * =========================================================
   * FACEBOOK SIGN-IN
   * =========================================================
   */

  const handleFacebookPress =
    async () => {
      /*
       * Facebook App ID is required.
       */
      if (!facebookAppId) {
        setError(
          "Facebook login needs EXPO_PUBLIC_FACEBOOK_APP_ID."
        );

        return;
      }

      /*
       * Check Facebook OAuth request.
       */
      if (!facebookRequest) {
        setError(
          "Facebook login is still loading. Please try again."
        );

        return;
      }

      try {
        setError("");
        setIsLoading(true);

        const result =
          await promptFacebookAsync();

        console.log(
          "Facebook OAuth result:",
          result
        );

        /*
         * Check access token.
         */
        if (
          result.type !==
            "success" ||
          !result.params?.access_token
        ) {
          if (
            result.type ===
            "cancel"
          ) {
            return;
          }

          setError(
            "Facebook login was not completed."
          );

          return;
        }

        /*
         * Firebase Facebook authentication.
         */
        const user =
          await loginWithFacebook(
            result.params.access_token
          );

        console.log(
          "Facebook Firebase login successful!"
        );

        console.log(
          "UID:",
          user.uid
        );

        console.log(
          "Email:",
          user.email
        );

        onAuthenticated(
          user.displayName ??
            user.email ??
            "Facebook User"
        );
      } catch (error: any) {
        console.log(
          "Facebook login error:",
          error
        );

        setError(
          error?.code ===
            "auth/account-exists-with-different-credential"
            ? "This email is already linked to another sign-in method."
            : "Facebook login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

  /**
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <SafeAreaView
      style={
        styles.authSafeArea
      }
    >
      <StatusBar
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={
          styles.authContainer
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Brand */}
        <View
          style={
            styles.brandMark
          }
        >
          <Text
            style={
              styles.brandMarkText
            }
          >
            SR
          </Text>
        </View>

        <Text
          style={
            styles.authEyebrow
          }
        >
          REAL-TIME STUDY SPACE
        </Text>

        <Text
          style={
            styles.authTitle
          }
        >
          {isRegistering
            ? "Create your account"
            : "Welcome back"}
        </Text>

        <Text
          style={
            styles.authSubtitle
          }
        >
          {isRegistering
            ? "Join your campus study community."
            : "Find a room and get into focus."}
        </Text>

        <View
          style={
            styles.authForm
          }
        >
          {/* Full name */}
          {isRegistering && (
            <View style={styles.authInputWrap}>
              <Ionicons name="person-outline" size={18} color="#B8A46A" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor="#8E9AA8"
                style={styles.authInputField}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* Email */}
          <View style={styles.authInputWrap}>
            <Ionicons name="mail-outline" size={18} color="#B8A46A" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="University email"
              placeholderTextColor="#8E9AA8"
              style={styles.authInputField}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.authInputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#B8A46A" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#8E9AA8"
              style={styles.authInputField}
              secureTextEntry
            />
          </View>

          {/* Error */}
          {!!notice && <Text style={styles.authNotice}>{notice}</Text>}
          {!!error && (
            <Text
              style={
                styles.authError
              }
            >
              {error}
            </Text>
          )}

          {/* Email button */}
          <Pressable
            onPress={submit}
            disabled={
              isLoading
            }
            style={({
              pressed,
            }) => [
              styles.primaryButton,

              pressed &&
                styles.buttonPressed,

              isLoading && {
                opacity: 0.6,
              },
            ]}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              {isLoading
                ? "Please wait..."
                : isRegistering
                  ? "Create account"
                  : "Log in"}
            </Text>
          </Pressable>

          {/* Divider */}
          <View
            style={
              styles.authDivider
            }
          >
            <View
              style={
                styles.authDividerLine
              }
            />

            <Text
              style={
                styles.authDividerText
              }
            >
              or continue with
            </Text>

            <View
              style={
                styles.authDividerLine
              }
            />
          </View>

          {/* Google */}
          <Pressable
            onPress={
              handleGooglePress
            }
            disabled={
              isLoading ||
              !googleRequest
            }
            style={({
              pressed,
            }) => [
              styles.socialButton,

              pressed &&
                styles.buttonPressed,

              isLoading && {
                opacity: 0.6,
              },
            ]}
          >
            <Ionicons name="logo-google" size={18} color="#DBA83B" />

            <Text
              style={
                styles.socialButtonText
              }
            >
              Continue with Google
            </Text>
          </Pressable>

          {/* Facebook */}
          <Pressable
            onPress={
              handleFacebookPress
            }
            disabled={
              isLoading ||
              !facebookRequest
            }
            style={({
              pressed,
            }) => [
              styles.socialButton,

              styles.facebookButton,

              pressed &&
                styles.buttonPressed,

              isLoading && {
                opacity: 0.6,
              },
            ]}
          >
            <Ionicons name="logo-facebook" size={19} color="#FFFFFF" />

            <Text
              style={[
                styles.socialButtonText,
                styles.facebookButtonText,
              ]}
            >
              Continue with Facebook
            </Text>
          </Pressable>
        </View>

        {/* Switch login/register */}
        <Pressable
          onPress={() => {
            setIsRegistering(
              (current) =>
                !current
            );

            setError("");
            setNotice("");
          }}
          style={
            styles.authSwitch
          }
          disabled={
            isLoading
          }
        >
          <Text
            style={
              styles.authSwitchText
            }
          >
            {isRegistering
              ? "Already have an account? "
              : "Don't have an account? "}

            <Text
              style={
                styles.authSwitchAction
              }
            >
              {isRegistering
                ? "Log in"
                : "Sign up"}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
