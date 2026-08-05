import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon, IconButton, TextInput, TouchableRipple } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function StepFinishBooking({ date, time, setTime, setDate, isPerson, setReceiveName, receiveName, telephone, setTelephone }) {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            // Si la fecha seleccionada es hoy, establece el tiempo mínimo en la hora actual
            if (selectedDate.toDateString() === new Date().toDateString()) {
                const currentTime = new Date();
                setTime(new Date(selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes())));
            } else {
                setTime(selectedDate); // Establece el tiempo a la fecha seleccionada si no es hoy
            }
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);

        if (selectedTime) {
            // Obtener las partes de la fecha seleccionada
            const selectedDate = new Date(date);

            // Obtener el año, mes y día de la fecha seleccionada
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const day = selectedDate.getDate();

            // Extraer horas y minutos seleccionados
            const localHours = selectedTime.getHours();
            const localMinutes = selectedTime.getMinutes();

            // Crear una fecha manualmente, pero sin que ajuste a UTC
            selectedDate.setHours(localHours, localMinutes, 0, 0);

            console.log('::: Hora seleccionada (local):', localHours + ':' + localMinutes);
            console.log('::: Fecha final con hora seleccionada (sin ajuste UTC):', selectedDate);

            // Validar si la fecha es hoy y la hora seleccionada es anterior a la actual
            const currentDate = new Date();
            if (selectedDate.toDateString() === currentDate.toDateString() && selectedDate < currentDate) {
                // Ajustar la fecha si es necesario para evitar horas pasadas
                selectedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
            }

            // Establecer la fecha final con la hora seleccionada
            setTime(selectedDate);
        }
    };


    const today = new Date();
    const minTime = date.toDateString() === today.toDateString()
        ? today
        : new Date(0, 0, 0, 0, 0, 0);

    return (
        <>
            <Text style={styles.modalTitle}> {isPerson ?  'Seleccione la fecha y hora' : 'Fecha y datos de quien recibe'}</Text>
            <TouchableRipple onPress={showDatePickerModal}>
                <View style={styles.datePicker}>
                    <IconButton
                        icon="calendar-blank"  // Icono de calendario
                        size={20}
                        iconColor="#323232"
                        style={styles.iconStyle}
                    />
                    <Text style={styles.datePickerText}>Fecha</Text>
                    <Text style={styles.datePickerValue}>{date.toLocaleDateString()}</Text>
                </View>
            </TouchableRipple>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
            <TouchableRipple onPress={showTimePickerModal}>
                <View style={styles.datePicker}>
                    <IconButton
                        icon="clock-time-five-outline"  // Icono de calendario
                        size={20}
                        style={styles.iconStyle}
                        iconColor="#323232"
                    />
                    <Text style={styles.datePickerText}>Hora</Text>
                    <Text style={styles.datePickerValue}>{time.toLocaleTimeString()}</Text>
                </View>
            </TouchableRipple>
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    locale='es'
                    display="default"
                    onChange={handleTimeChange}
                    minimumDate={minTime}
                />
            )}
            {
                !isPerson && (
                    <>
                        <TextInput
                            label="Nombre de quien recibe"
                            mode="outlined"
                            activeOutlineColor='rgba(100, 100, 100, 1)'
                            textColor="black"
                            style={styles.input}
                            outlineStyle={styles.inputOutline}
                            onChangeText={(text) => {
                                const filteredText = text.replace(/[^a-zA-ZñÑ\s]+/g, '');
                                setReceiveName(filteredText)
                            }}
                            value={receiveName}
                            left={<TextInput.Icon size={20} icon="account-outline" color="#323232"/>}
                        />
                        <TextInput
                            label="Telefono"
                            mode="outlined"
                            activeOutlineColor='rgba(100, 100, 100, 1)'
                            textColor="black"
                            style={styles.input}
                            outlineStyle={styles.inputOutline}
                            keyboardType='numeric'
                            textContentType='telephoneNumber'
                            onChangeText={(text) => {
                                setTelephone(text)
                            }}
                            maxLength={10}
                            value={telephone}
                            left={<TextInput.Icon size={20} icon="phone-outline" color="#323232"/>}
                        />
                    </>
                )
            }
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
        fontSize: 16,
        paddingLeft: 25,
        textShadowColor: 'black',
        height: 60,
    },
    inputOutline: {
        borderColor: 'rgba(184, 184, 184, 1)',
        borderRadius: 8
    },
    iconStyle: {
        marginRight: 2,
        marginLeft: -2
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
        justifyContent: 'flex-start',
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
        color: "#5A5A5A",
        flex:1
    },
    datePickerValue: {
        fontSize: 16,
        color: "#323232",
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
