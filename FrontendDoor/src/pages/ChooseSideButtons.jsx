import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function ChooseSideButtons({ dialogVisible, onCamera, onGallery, onClose, selectedSide }) {
    return (
        <Modal transparent visible={dialogVisible} animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.optionBox} onPress={() => {
                            onGallery()
                        }} >
                            <Icon name="upload-outline" size={36} color="#021352" />
                            <Text style={styles.label}>Subir imagen {selectedSide}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionBox} onPress={() => {
                            onCamera()

                        }}>
                            <Icon name="camera-outline" size={36} color="#021352" />
                            <Text style={styles.label}>Tomar una foto {selectedSide}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 12,
        gap: 20,
    },
    optionBox: {
        backgroundColor: '#F7F7F7',
        width: 120,
        height: 120,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    label: {
        marginTop: 10,
        color: '#092C4C',
        fontWeight: '400',
        textAlign: 'center',
    },
});