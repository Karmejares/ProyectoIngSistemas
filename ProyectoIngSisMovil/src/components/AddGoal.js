import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addGoal, updateGoal, fetchGoals } from "../redux/goalsSlice";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
  List,
  Divider,
} from "react-native-paper";

const AddGoal = ({ visible, onClose, goalToEdit }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stepInput: "",
    plan: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        title: goalToEdit.title || "",
        description: goalToEdit.description || "",
        plan: goalToEdit.plan || [],
        stepInput: "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        stepInput: "",
        plan: [],
      });
    }
    setErrors({});
  }, [goalToEdit, visible]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Max length is 500 characters";
    }

    if (formData.plan.length === 0) {
      newErrors.plan = "At least one step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const normalizedPlan = formData.plan.map((p) => ({
      stepDescription: typeof p === "string" ? p : p.stepDescription || "",
      date: p.date || null,
    }));

    const goalData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      plan: normalizedPlan,
      history: goalToEdit?.history || [],
    };

    try {
      if (goalToEdit) {
        await dispatch(updateGoal({ ...goalData, _id: goalToEdit._id }));
      } else {
        await dispatch(addGoal(goalData));
      }
      await dispatch(fetchGoals());
      onClose();
    } catch (err) {
      console.error("Error saving goal", err);
      Alert.alert("Error", "Failed to save goal. Please try again.");
    }
  };

  const handleAddStep = () => {
    const currentStep = formData.stepInput.trim();
    if (currentStep) {
      setFormData({
        ...formData,
        plan: [...formData.plan, { stepDescription: currentStep, date: null }],
        stepInput: "",
      });
    }
  };

  const handleRemoveStep = (index) => {
    const newPlan = [...formData.plan];
    newPlan.splice(index, 1);
    setFormData({
      ...formData,
      plan: newPlan,
    });
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView style={styles.scrollView}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>
                  {goalToEdit ? "Edit Goal" : "Add a New Goal"}
                </Title>
                <Paragraph style={styles.subtitle}>
                  {goalToEdit
                    ? "Edit the details of your goal and update the plan as needed."
                    : "Fill in the details for your new goal, and add steps to your plan."}
                </Paragraph>

                {/* Title Input */}
                <TextInput
                  label="Title"
                  value={formData.title}
                  onChangeText={(value) => updateField("title", value)}
                  style={styles.input}
                  error={!!errors.title}
                  mode="outlined"
                />
                {errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}

                {/* Description Input */}
                <TextInput
                  label="Description"
                  value={formData.description}
                  onChangeText={(value) => updateField("description", value)}
                  style={styles.input}
                  error={!!errors.description}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.helperText}>
                  {formData.description.length}/500 characters
                </Text>
                {errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}

                {/* Step Input */}
                <View style={styles.stepInputContainer}>
                  <TextInput
                    label="Add Step"
                    value={formData.stepInput}
                    onChangeText={(value) => updateField("stepInput", value)}
                    style={styles.stepInput}
                    mode="outlined"
                    onSubmitEditing={handleAddStep}
                  />
                  <IconButton
                    icon="plus"
                    mode="contained"
                    onPress={handleAddStep}
                    disabled={!formData.stepInput.trim()}
                    style={styles.addButton}
                  />
                </View>
                <Text style={styles.helperText}>
                  Create a timeline for your goal. Each step will be assigned a
                  completion date when you mark it as done.
                </Text>

                {/* Steps List */}
                {formData.plan.length > 0 && (
                  <View style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>Steps:</Text>
                    {formData.plan.map((item, index) => (
                      <View key={index} style={styles.stepItem}>
                        <Text style={styles.stepText}>
                          {item.stepDescription}
                        </Text>
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => handleRemoveStep(index)}
                        />
                      </View>
                    ))}
                  </View>
                )}

                {errors.plan && (
                  <Text style={styles.errorText}>{errors.plan}</Text>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={onClose}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.saveButton}
                    disabled={
                      !formData.title.trim() ||
                      !formData.description.trim() ||
                      formData.plan.length === 0
                    }
                  >
                    {goalToEdit ? "Update Goal" : "Save Goal"}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 20,
    marginTop: 50,
    marginBottom: 50,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    color: "#4a9c8c",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginBottom: 8,
  },
  stepInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#4a9c8c",
  },
  stepsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 4,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#4a9c8c",
  },
});

export default AddGoal;
