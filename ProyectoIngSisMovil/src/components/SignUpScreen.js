import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS } from "../config/api";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Card, Title, HelperText } from "react-native-paper";

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          dob: data.dob,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Registration failed");
      }

      Alert.alert(
        "Success",
        "Registration successful! Redirecting to login...",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Sign Up</Title>

            {/* Username Field */}
            <Controller
              control={control}
              name="username"
              rules={{
                required: "Username is required",
                minLength: {
                  value: 2,
                  message: "Username must be at least 2 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers and underscores",
                },
              }}
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

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <HelperText type="error">{errors.email.message}</HelperText>
            )}

            {/* Date of Birth Field */}
            <Controller
              control={control}
              name="dob"
              rules={{
                required: "Please enter a date",
                validate: (value) => {
                  if (!value) return "Date of birth is required";

                  const birthDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();

                  let actualAge = age;
                  if (
                    m < 0 ||
                    (m === 0 && today.getDate() < birthDate.getDate())
                  ) {
                    actualAge = age - 1;
                  }

                  return actualAge >= 21 || "Must be at least 21 years old";
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Date of Birth (YYYY-MM-DD)"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.dob}
                  style={styles.input}
                  placeholder="1990-01-01"
                />
              )}
            />
            {errors.dob && (
              <HelperText type="error">{errors.dob.message}</HelperText>
            )}

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
                  message:
                    "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one of the following symbols: @ $ ! % * ? & #. Other special characters are not allowed.",
                },
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

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Confirm Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.confirmPassword}
                  style={styles.input}
                  secureTextEntry
                />
              )}
            />
            {errors.confirmPassword && (
              <HelperText type="error">
                {errors.confirmPassword.message}
              </HelperText>
            )}

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#6bb5a2"
            >
              Register
            </Button>

            {/* Back to Login Button */}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Login")}
              style={styles.backButton}
              textColor="#6bb5a2"
            >
              Back to Log In
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f1f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
    borderColor: "#6bb5a2",
  },
});

export default SignUpScreen;
