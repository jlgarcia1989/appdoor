// LocationModal.js
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, TouchableRipple, RadioButton, MD3Colors, IconButton, Portal, TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { getLocations } from '../../services/Location/location';
import { useBooking } from '../../hooks/BookingContext';

import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import StepBookingPerson from './StepBookingPerson';
import StepBookingObject from './StepBookingObject';
import { useAuth } from '../../hooks/AuthContext';


const ModalBooking = ({ visible, onDismiss, city, typeBooking }) => {
    const [origin, setOrigin] = useState(null);
    const [currentUbication, setCurrentUbication] = useState(false);
    const [destination, setDestination] = useState(null);
    const [locations, setLocations] = useState([]);
    const [defaultOriginIndex, setDefaultOriginIndex] = useState(null);
    const [defaultDestinationIndex, setDefaultDestinationIndex] = useState(null);
    const [customLocationOrigin, setCustomLocationOrigin] = useState(null);
    const [customLocationDestination, setCustomLocationDestination] = useState(null);
    const [initialBooking, setInitialBooking] = useState(true);
    const { addBooking } = useBooking();
    const [booking, setBooking] = useState({});
    const { updateUser, user } = useAuth();
    const [visibleModal, setVisibleModal] = useState(false);
    const [textModal, setTextModal] = useState('');
    const [recentLocations, setRecentLocations] = useState([
        {
            name: 'Bogota',
            address: 'Avenida 26 crra 34'
        }
    ]);
    const [originAddress, setOriginAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');

    const ReservationSchemaService = Yup.object().shape({
        destination: Yup.object().required('El destino es obligatorio'),
        originAddress: Yup.string().required('La direccion origen es obligatoria'),
        destinationAddress: Yup.string().required('La direccion destino es obligatoria')
    });

    useEffect(() => {
        if (city) {
            getUbications()
            setCustomLocationOrigin(null)
            setCustomLocationDestination(null)
        }
    }, [city]);


    const hideDialog = () => {
        setVisibleModal(false)
    }

    const getUbications = async () => {
        city['county'] = user?.city ? user.city : city?.county
        const data = await getLocations();
        let dataUbications = data.map((ubi) => {
            return {
                id: ubi.idUbicacion,
                name: ubi.nombre
            };
        });

        if (!dataUbications.find((ubi) => ubi.name === city.county)) {
            dataUbications.push({ name: city.county });
        }

        const index = dataUbications.findIndex(item => item.name === city.county);

        if (index === 0) {
            const [firstItem] = dataUbications.splice(index, 1);
            dataUbications.push(firstItem);
        }

        setLocations(dataUbications);

        const newIndex = dataUbications.findIndex(item => item.name === city.county);
        setDefaultOriginIndex(newIndex);
        setOrigin(dataUbications[newIndex]);
        setCurrentUbication(dataUbications[newIndex])
        setOriginAddress(`${city.road} ${city.neighbourhood}`)
    };

    const handleOriginSelect = (item, setFieldValue) => {
        if (item) {
            item !== currentUbication ?
                setFieldValue('originAddress', "")
                : setFieldValue('originAddress', `${city.road} ${city.neighbourhood}`)
            setOrigin(item);
        } else {
            origin !== currentUbication ?
                setFieldValue('originAddress', "")
                : setFieldValue('originAddress', `${city.road} ${city.neighbourhood}`)
            setOrigin({ name: origin });
        }
        setCustomLocationOrigin(null)
    };

    const handleDestinationSelect = (item, setFieldValue) => {
        if (item) {
            setDestination(item);
            setFieldValue('destination', item);
        } else {
            setDestination({ name: destination });
            setFieldValue('destination', { name: destination });
        }
        setCustomLocationDestination(null);

    };

    const handleTextChange = (text, type, setFieldValue) => {
        if (!locations.find((loc) => loc.name === text)) {
            if (type === 'origin') {
                setCustomLocationOrigin({ id: 'custom', name: text });
            } else {
                setCustomLocationDestination({ id: 'custom', name: text })
            }
        } else {
            setCustomLocationOrigin(null);
            setCustomLocationDestination(null)
        }
        setFieldValue(type, text);
    };

    const handleCustomSelect = (type, setFieldValue) => {
        if (type === 'origin' && customLocationOrigin) {
            setOrigin(customLocationOrigin);
            setCustomLocationOrigin(null);
            setFieldValue('origin', customLocationOrigin);
            setFieldValue('originAddress', "");
        } else if (type === 'destination' && customLocationDestination) {
            setDestination(customLocationDestination);
            setCustomLocationDestination(null);
            setFieldValue('destination', customLocationDestination);
        }
    };

    const onSubmit = async (values) => {
        if (initialBooking) {
            const parameters = {
                typeBooking,
                origin,
                destination,
                originAddress: values.originAddress,
                destinationAddress: values.destinationAddress
            };
            setBooking({ ...parameters });
            setInitialBooking(false);
        }
    };

    const onFinish = (values) => {
        const now = new Date();
        const combinedDateTime = new Date(values.date);
        combinedDateTime.setHours(values.time.getHours() - 5);
        combinedDateTime.setMinutes(values.time.getMinutes());

        const isoDateTime = combinedDateTime.toISOString();

        const parameters = {
            ...booking,
            dateTime: isoDateTime,
            passengers: values.passengers
        };
        addBooking(parameters);
        setInitialBooking(true)
        onDismiss(parameters);
    }

    const onFinishObject = (values) => {
        const now = new Date();
        const combinedDateTime = new Date(values.date);
        combinedDateTime.setHours(values.time.getHours() - 5);
        combinedDateTime.setMinutes(values.time.getMinutes());

        const isoDateTime = combinedDateTime.toISOString();

        const parameters = {
            ...booking,
            dateTime: isoDateTime,
            receiveName: values.receiveName,
            phone: values.telephone,
            objects: values.objects
        };
        console.log(':::values:::', parameters)
        addBooking(parameters);
        setInitialBooking(true)
        onDismiss(parameters);
    }

    return (
        <>
            {
                visibleModal ?
                    <ModalDialog
                        visibleModal={visibleModal}
                        title="Ups!"
                        description={textModal}
                        icon={iconModal.alert}
                        hideDialog={hideDialog}
                        colorIcon='rgb(186, 26, 26)'
                    /> :
                    <Modal
                        isVisible={visible}
                        onBackdropPress={() => {
                            setInitialBooking(true)
                            setCustomLocationOrigin(null);
                            setCustomLocationDestination(null)
                            onDismiss()
                        }}
                        /*                         onSwipeComplete={() => {
                                                    setInitialBooking(true)
                                                    setCustomLocationOrigin(null);
                                                    setCustomLocationDestination(null)
                                                    onDismiss()
                                                }}
                                                swipeDirection="down" */
                        style={styles.modalContainer}
                    >
                        {
                            initialBooking ?
                                <Formik
                                    initialValues={{
                                        destination: destination ? destination[0]?.name : '',
                                        originAddress: origin !== currentUbication ? "" : originAddress,
                                        destinationAddress: ""
                                    }}
                                    validationSchema={ReservationSchemaService}
                                    onSubmit={onSubmit}
                                >
                                    {({ setFieldValue, values, handleSubmit, handleBlur, errors, touched }) => (
                                        <>
                                            <View style={styles.modalContent}>
                                                <View style={styles.handle} />
                                                <Text style={styles.modalTitle}>Seleccione su servicio</Text>
                                                <Field name="origin">
                                                    {({ field }) => (
                                                        <>
                                                            <SearchableDropdown
                                                                onTextChange={(text) => handleTextChange(text, 'origin', setFieldValue)}
                                                                onItemSelect={(item) => handleOriginSelect(item, setFieldValue)}
                                                                containerStyle={styles.dropdownContainer}
                                                                selectedItems={origin}
                                                                onBlur={() => setCustomLocationOrigin(null)}
                                                                textInputStyle={styles.dropdownTextInput}
                                                                itemStyle={styles.dropdownItem}
                                                                itemTextStyle={styles.dropdownItemText}
                                                                itemsContainerStyle={styles.dropdownItemsContainer}
                                                                items={locations}
                                                                placeholder="Seleccione origen"
                                                                placeholderTextColor="#999"
                                                                resetValue={false}
                                                                underlineColorAndroid="transparent"
                                                                defaultIndex={defaultOriginIndex}
                                                            />

                                                            {customLocationOrigin &&
                                                                <Button onPress={() => handleCustomSelect('origin', setFieldValue)} disabled={!customLocationOrigin} style={styles.customButton} labelStyle={{ color: 'black' }}>
                                                                    Usar "{customLocationOrigin?.name}" como origen
                                                                </Button>
                                                            }
                                                            {touched.origin && errors.origin && (
                                                                <Text style={styles.errorText}>{errors.origin}</Text>
                                                            )}

                                                        </>
                                                    )}
                                                </Field>
                                                {origin !== currentUbication && (
                                                    <View style={styles.textInputIcon}>
                                                        <TextInput
                                                            placeholder="Ingrese la dirección origen"
                                                            mode="outlined"
                                                            textColor='black'
                                                            activeOutlineColor='rgba(100, 100, 100, 1)'
                                                            style={styles.input}
                                                            placeholderTextColor="#999"
                                                            outlineStyle={[
                                                                styles.inputOutline,
                                                                touched.originAddress && errors.originAddress ? styles.inputErrorText : null,
                                                            ]}
                                                            onChangeText={(text) => {
                                                                setFieldValue('originAddress', text);
                                                            }}
                                                            onBlur={handleBlur('originAddress')}
                                                            value={values.originAddress}
                                                            error={touched.originAddress && errors.originAddress ? true : false}
                                                        />
                                                        {touched.originAddress && errors.originAddress && <Text style={styles.errorText}>{errors.originAddress}</Text>}
                                                    </View>
                                                )}
                                                <Field name="destination">
                                                    {({ field }) => (
                                                        <>
                                                            <SearchableDropdown
                                                                onTextChange={(text) => handleTextChange(text, 'destination', setFieldValue)}
                                                                onItemSelect={(item) => handleDestinationSelect(item, setFieldValue)}
                                                                containerStyle={styles.dropdownContainer}
                                                                selectedItems={destination}
                                                                onBlur={() => setCustomLocationDestination(null)}
                                                                textInputStyle={touched.destination && errors.destination ? styles.inputError : styles.dropdownTextInput}
                                                                itemStyle={styles.dropdownItem}
                                                                itemTextStyle={styles.dropdownItemText}
                                                                itemsContainerStyle={styles.dropdownItemsContainer}
                                                                items={locations}
                                                                placeholder="Seleccione su destino"
                                                                placeholderTextColor="#999"
                                                                resetValue={false}
                                                                underlineColorAndroid="transparent"
                                                            />
                                                            {customLocationDestination &&
                                                                <Button onPress={() => handleCustomSelect('destination', setFieldValue)} disabled={!customLocationDestination} style={styles.customButton} labelStyle={{ color: 'black' }}>
                                                                    Usar "{customLocationDestination?.name}" como destino
                                                                </Button>
                                                            }
                                                            {touched.destination && errors.destination && (
                                                                <Text style={styles.errorText}>{errors.destination}</Text>
                                                            )}
                                                        </>
                                                    )}
                                                </Field>
                                                <View style={styles.textInputIcon}>
                                                    <TextInput
                                                        placeholder="Ingrese la dirección destino"
                                                        mode="outlined"
                                                        textColor='black'
                                                        activeOutlineColor='rgba(100, 100, 100, 1)'
                                                        style={styles.input}
                                                        placeholderTextColor="#999"
                                                        outlineStyle={[
                                                            styles.inputOutline,
                                                            touched.destinationAddress && errors.destinationAddress ? styles.inputError : null,
                                                        ]}
                                                        onChangeText={(text) => {
                                                            setFieldValue('destinationAddress', text);
                                                        }}
                                                        onBlur={handleBlur('destinationAddress')}
                                                        value={values.destinationAddress}
                                                        error={touched.destinationAddress && errors.destinationAddress ? true : false}
                                                    />
                                                    {touched.destinationAddress && errors.destinationAddress && <Text style={styles.errorText}>{errors.destinationAddress}</Text>}
                                                </View>
                                                {/* Lugares recientes */}
                                                <ScrollView>
                                                    <View style={styles.recentLocationsContainer}>
                                                        <Text style={styles.recentLocationsTitle}>Lugares recientes</Text>
                                                        {recentLocations.length > 0 ? (
                                                            recentLocations.map((location, index) => (
                                                                <View key={index} style={styles.recentLocationItem}>
                                                                    <Icon
                                                                        source="map-marker"
                                                                        color={MD3Colors.neutral50}
                                                                        size={20}
                                                                    />
                                                                    <View style={styles.recentLocationTextContainer}>
                                                                        <Text style={styles.recentLocationText}>{location.name}</Text>
                                                                        <Text style={styles.recentLocationAddress}>{location.address}</Text>
                                                                    </View>
                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text style={styles.noRecentLocationsText}>No hay lugares recientes.</Text>
                                                        )}
                                                    </View>
                                                </ScrollView>
                                            </View>
                                            <View style={styles.contentButton}>
                                                <Button mode="contained" labelStyle={styles.buttonLabel} onPress={handleSubmit} style={styles.modalButton}>
                                                    Siguiente
                                                </Button>
                                            </View>
                                        </>
                                    )}
                                </Formik>
                                :
                                typeBooking === "Pasajero" ?
                                    <StepBookingPerson onSubmit={(values) => onFinish(values)} onDismiss={onDismiss} setInitialBooking={setInitialBooking} />
                                    : <StepBookingObject onSubmit={(values) => onFinishObject(values)} onClose={onDismiss} setInitialBooking={setInitialBooking} />
                        }
                    </Modal>
            }



        </>
    );
};

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
        alignItems: 'center'
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
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: "rgba(42, 42, 42, 1)"
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
        justifyContent: 'space-between'
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

export default ModalBooking;
