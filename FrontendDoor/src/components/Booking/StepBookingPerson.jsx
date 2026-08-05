import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button, IconButton, MD3Colors, RadioButton, TouchableRipple } from 'react-native-paper';
import StepFinishBooking from './StepFinishBooking';

export default function StepBookingPerson({ onSubmit, setInitialBooking, onDismiss }) {

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [passengers, setPassengers] = useState(1);

    const submitData = () => {
        onSubmit({
            date,
            time,
            passengers
        })
    }

    return (
        <>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <IconButton
                        icon="arrow-left"
                        iconColor={MD3Colors.neutral0}
                        color
                        size={23}
                        onPress={() => setInitialBooking(true)}
                    />
                    <View style={styles.handle} />
                    <IconButton
                        icon="close"
                        iconColor={MD3Colors.neutral0}
                        size={23}
                        onPress={() => {
                            setInitialBooking(true);
                            onDismiss()
                        }}
                    />
                </View>
                <StepFinishBooking date={date} time={time} setTime={(time) => setTime(time)} setDate={(date) => setDate(date)} isPerson = {true} receiveName={''}/>
                <Text style={styles.modalFooterTitle}>Seleccione la cantidad de pasajeros</Text>
                <View style={styles.passengerOptions}>
                    {[1, 2, 3, 4].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                styles.passengerBox,
                                passengers === num && styles.selectedBox
                            ]}
                            onPress={() => setPassengers(num)}
                        >
                            <Text style={[styles.passengerText, passengers === num && styles.selectedText]}>
                                {num}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.contentButton}>
                <Button mode="contained" labelStyle={styles.buttonLabel} onPress={submitData} style={styles.modalButton}>
                    Terminar
                </Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
        color: "rgba(42, 42, 42, 1)",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD"
    },
    modalFooterTitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'left',
        color: "#5A5A5A"
    },
    contentButton: {
        backgroundColor: 'white',
    },
    modalButton: {
        backgroundColor: 'rgba(9, 44, 76, 1)',
        margin: 15,
        borderRadius: 8,
        gap: 10,
        height: 54,
        justifyContent: 'center',
    },
    buttonLabel: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dropdownContainer: {
        marginBottom: 5,
    },
    dropdownTextInput: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#000',
        paddingLeft: 40,
    },
    inputError: {
        borderColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
        color: '#000',
        paddingLeft: 40,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownItemText: {
        color: '#000',
    },
    dropdownItemsContainer: {
        maxHeight: 140,
    },
    errorText: {
        marginLeft: 5,
        color: 'red'
    },
    input: {
        marginBottom: 5,
        backgroundColor: '#fff',
        borderColor: 'rgba(208, 208, 208, 1)',
        fontSize: 14,
        paddingLeft: 25,
        textShadowColor: 'black'
    },
    inputOutline: {
        borderColor: 'rgba(184, 184, 184, 1)',
        borderRadius: 8
    },
    iconStyle: {
        marginRight: 10,
        paddingLeft: 6
    },
    customButton: {
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 8
    },
    datePicker: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
    },
    datePickerText: {
        fontSize: 16,
        color: '#000',
    },
    datePickerValue: {
        fontSize: 16,
        color: '#000',
    },
    passengerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    passengerBox: {
        width: 62,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
    },
    selectedBox: {
        borderColor: '#092C4C',
        borderWidth: 2,
    },
    passengerText: {
        fontSize: 18,
        color: '#555',
    },
    selectedText: {
        color: '#092C4C',
        fontWeight: 'bold',
    },
    recentLocationsContainer: {
        marginTop: 10,
    },
    recentLocationsTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: 'rgba(90, 90, 90, 1)'
    },
    recentLocationTextContainer: {
        flex: 1,
    },
    recentLocationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    recentLocationText: {
        fontSize: 14,
        color: 'rgba(90, 90, 90, 1)',
        marginLeft: 5
    },
    recentLocationAddress: {
        fontSize: 14,
        color: 'rgba(184, 184, 184, 1)',
        marginLeft: 5
    },
    noRecentLocationsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    inputErrorText: {
        borderColor: 'red',
    },
});