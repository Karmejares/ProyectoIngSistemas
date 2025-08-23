import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import { API_ENDPOINTS } from "../config/api";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Card, Title, HelperText } from "react-native-paper";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logInUser } = useContext(UserContext);
  const navigation = useNavigation();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      console.log("🔍 API URL being used:", API_ENDPOINTS.LOGIN);
      console.log("📤 Sending login data:", data);

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await response.json();
      logInUser(responseData.token);
      navigation.navigate("Application");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.centerContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Log In</Title>

            {/* Username Field */}
            <Controller
              control={control}
              name="username"
              rules={{ required: "Username is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Username"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.username}
                  style={styles.input}
                />
              )}
            />
            {errors.username && (
              <HelperText type="error">{errors.username.message}</HelperText>
            )}

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.password}
                  style={styles.input}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <HelperText type="error">{errors.password.message}</HelperText>
            )}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#6bb5a2"
            >
              Log In
            </Button>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkHighlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f1f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 300,
    elevation: 0,
    shadowColor: "transparent",
    backgroundColor: "#e6f1f5",
  },
  title: {
    color: "#4a9c8c",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#666",
  },
  linkHighlight: {
    color: "#4a9c8c",
    fontWeight: "bold",
  },
});

export default LoginScreen;
