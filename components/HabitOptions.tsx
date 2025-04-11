import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { Edit, Trash2, Archive, X } from 'lucide-react-native';

interface HabitOptionsProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export default function HabitOptions({
  visible,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}: HabitOptionsProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Habit Options</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.textLight} />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
            ]}
            onPress={onEdit}
          >
            <Edit size={20} color={colors.primary} />
            <Text style={styles.optionText}>Edit Habit</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
            ]}
            onPress={onArchive}
          >
            <Archive size={20} color={colors.textLight} />
            <Text style={styles.optionText}>Archive Habit</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.option,
              styles.deleteOption,
              pressed && styles.optionPressed,
            ]}
            onPress={onDelete}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.optionText, styles.deleteText]}>Delete Habit</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '80%',
    maxWidth: 320,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionPressed: {
    backgroundColor: colors.borderLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 8,
    paddingTop: 16,
  },
  deleteText: {
    color: colors.danger,
  },
});