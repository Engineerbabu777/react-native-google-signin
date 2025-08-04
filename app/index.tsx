import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

GoogleSignin.configure({
  webClientId: "WEB_CLIENT_ID",
  iosClientId: "IOS_CLIENT_ID",
});

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // const idToken = response.data.idToken;

        setLoading(false);

        setUserInfo(response.data);

        // FOR USING ON BACKEND!
        // const res = await fetch("http://192.168.100.6:5000/verify-token", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ idToken }),
        // });

        // const data = await res.json();
        // if (data?.success) {
        //   setLoading(false);

        //   setUserInfo(data);
        // }
        // console.log("Backend response:", data);
      } else {
        console.log("Sign in was cancelled by user");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Operation already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available or outdated");
            break;
          default:
            console.log("Some other error happened");
        }
      } else {
        console.log("An unrelated error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.card}>
          <Image
            source={{ uri: userInfo.user?.picture ?? userInfo.user?.photo }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userInfo?.user?.name}</Text>
          <Text style={styles.email}>{userInfo?.user?.email}</Text>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={async () => {
              await GoogleSignin.signOut();
              setUserInfo(null);
            }}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.title}>Welcome! Sign in with Google</Text>
          <GoogleSigninButton
            style={{ width: 212, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  signInContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: 300,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 999,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#e63946",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
