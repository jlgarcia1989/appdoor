import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { IconButton, MD3Colors, TextInput } from 'react-native-paper';
import StepFinishBooking from './StepFinishBooking';
import ChooseImageDialog from '../../pages/DialogCamera';


export default function StepBookingObject({ onSubmit, onClose, setInitialBooking }) {

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [receiveName, setReceiveName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [packages, setPackages] = useState([]);
    const [imageUris, setImageUris] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [openedCards, setOpenedCards] = useState({});
    const [finishStep, setFinishStep] = useState(false);
    const [objectType, setObjectType] = useState({
        icon:'',
        name:''
    });
    const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
    const [dimensions, setDimensions] = useState(
        packages.reduce((acc, _, index) => ({
            ...acc,
            [index]: { alto: '', ancho: '' }, // Inicializamos cada encomienda con campos vacíos
        }), {})
    );

    const handleDimensionChange = (index, field, value) => {
        setDimensions(prevState => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                [field]: value,
            }
        }));
    };

    // Ahora usaremos iconos para representar cada tipo de encomienda
    const sizes = [
        { name: 'Pequeño', icon: 'package-variant' },
        { name: 'Mediano', icon: 'package-variant-closed' },
        { name: 'Grande', icon: 'package-variant' },
        { name: 'Mascotas', icon: 'dog' },
    ];
    const quantities = [1, 2, 3];

    useEffect(() => {
        const allFieldsFilled = () => {
            // Verifica que se haya seleccionado al menos un tamaño
            const sizesSelected = selectedSizes.length > 0;

            // Verifica que se haya seleccionado una cantidad válida (máximo 3)
            const quantitySelected = selectedQuantity > 0;

            const allPackagesFilled = packages.every((_, index) => {
                const dimension = dimensions[index] || {};
                return (
                    openedCards[index] &&
                    imageUris[index] &&
                    dimension.alto !== '' &&
                    dimension.ancho !== ''
                );
            });

            // Si todos los campos están completos, habilita el botón
            return sizesSelected && quantitySelected && allPackagesFilled;
        };

        // Actualiza el estado del botón "Siguiente"
        setIsNextButtonEnabled(allFieldsFilled());
    }, [selectedSizes, selectedQuantity, openedCards, imageUris, packages]);

    const toggleSizeSelection = (size) => {
        if (selectedSizes.includes(size.name)) {
            setSelectedSizes(selectedSizes.filter(selectedSize => selectedSize !== size.name));
        } else {
            setSelectedSizes([...selectedSizes, size.name]);
        }
        setObjectType(size)
    };

    const toggleCard = (index) => {
        setOpenedCards((prevState) => ({
          ...prevState,
          [index]: !prevState[index], // Cambia el estado del card al hacer clic
        }));
      };

    const increaseQuantity = (quantity) => {
        const packageSet = []
        for (let index = 0; index < quantity; index++) {
            packageSet.push({ id: index + 1 })
        }
        setSelectedQuantity(quantity)
        setPackages(packageSet)
    };

    const removePackage = (id) => {
        setPackages(packages.filter(pkg => pkg.id !== id));
        setSelectedQuantity(prevQuantity => prevQuantity - 1);
        setImageUris((prevUris) => prevUris.filter((_, i) => i !== id - 1));
    };

    const handleChooseFromGallery = (index) => {
        setSelectedIndex(index);
        setDialogVisible(true);
    };

    const nextStep = (stateStep) => {
        if (!finishStep) {
            setFinishStep(stateStep)
        } else {
             onSubmit({
                date,
                time,
                objects: Object.values(dimensions),
                size:selectedSizes[0],
                receiveName,
                telephone
            })
        }
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
                    onPress={() => {
                        setInitialBooking(true);
                        setFinishStep(false);
                    }}
                />
                <View style={styles.handle} />
                <IconButton
                    icon="close"
                    iconColor={MD3Colors.neutral0}
                    size={23}
                    onPress={() => {
                        setInitialBooking(true);
                        setFinishStep(false);
                        onClose()
                    }}
                />
            </View>
            {
                !finishStep ?
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Tipo de Encomienda</Text>
                        <View style={styles.sizeContainer}>
                            {sizes.map((size, index) => (
                                <TouchableOpacity
                                    key={size.name}
                                    style={[
                                        styles.sizeButton,
                                        selectedSizes.includes(size.name) && styles.selectedSizeButton,
                                        (index + 1) % 3 === 0 ? styles.sizeButtonLastInRow : {},
                                    ]}
                                    onPress={() => toggleSizeSelection(size)}
                                >
                                    <IconButton icon={size.icon} size={24} color={selectedSizes.includes(size.name) ? '#092C4C' : '#5A5A5A'} iconColor='black' />
                                    <Text style={[
                                        styles.sizeText,
                                        selectedSizes.includes(size.name) && styles.selectedSizeText,
                                    ]}>{size.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Cantidad de encomiendas (máximo: 3)</Text>
                        <View style={styles.quantityContainer}>
                            {quantities.map((quantity) => (
                                <TouchableOpacity
                                    key={quantity}
                                    style={[
                                        styles.quantityButton,
                                        selectedQuantity === quantity && styles.selectedQuantityButton,
                                    ]}
                                    onPress={() => increaseQuantity(quantity)}
                                >
                                    <Text style={[
                                        styles.quantityText,
                                        selectedQuantity === quantity && styles.selectedQuantityText,
                                    ]}>{quantity}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {
                            packages.map((q, index) => (
                                <View style={styles.packageContainer} key={index}>
                                    <TouchableOpacity onPress={() => toggleCard(index)} style={styles.packageHeader}>
                                        <Text style={styles.packageTitle}>{objectType?.icon === 'dog' ? 'Mascota' : 'Encomienda'} #{index + 1}</Text>
                                        <IconButton icon="close" iconColor='#000000' onPress={() => removePackage(index + 1)} />
                                    </TouchableOpacity>
                                    {openedCards[index] && (
                                        <>
                                            <View style={styles.inputRow}>
                                                <View style={styles.inputContainer}>
                                                    <IconButton icon="arrow-up-down" size={20} color="#5A5A5A" style={{ marginRight: -10 }} />
                                                    <TextInput
                                                        placeholder="Alto"
                                                        style={styles.inputField}
                                                        keyboardType="numeric"
                                                        placeholderTextColor='#5A5A5A'
                                                        mode="flat"
                                                        activeUnderlineColor='transparent'
                                                        activeOutlineColor='rgba(100, 100, 100, 1)'
                                                        textColor="black"
                                                        value={dimensions[index]?.alto}
                                                        onChangeText={(text) => handleDimensionChange(index, 'alto', text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <IconButton icon="arrow-left-right" size={20} color="#5A5A5A" style={{ marginRight: -10 }} />
                                                    <TextInput
                                                        placeholder="Ancho"
                                                        style={styles.inputField}
                                                        keyboardType="numeric"
                                                        placeholderTextColor='#5A5A5A'
                                                        mode="flat"
                                                        activeUnderlineColor='transparent'
                                                        activeOutlineColor='rgba(100, 100, 100, 1)'
                                                        textColor="black"
                                                        value={dimensions[index]?.ancho}
                                                        onChangeText={(text) => handleDimensionChange(index, 'ancho', text)}
                                                    />
                                                </View>
                                            </View>

                                            <TouchableOpacity style={styles.imagePlaceholder} onPress={() => handleChooseFromGallery(index)}>
                                                {imageUris[index] ? (
                                                    <Image source={{ uri: imageUris[index] }} style={styles.image} resizeMode="cover" />
                                                ) : (
                                                    <Text style={styles.imagePlaceholderText}>Añadir imagen</Text>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            ))
                        }
                    </ScrollView>
                    :
                    <View style={styles.modalFinishStep}>
                        <StepFinishBooking date={date} time={time} setTime={(time) => setTime(time)} setDate={(date) => setDate(date)} isPerson={false} setReceiveName={(text) => setReceiveName(text)} receiveName={receiveName} setTelephone={(number) => setTelephone(number)} telephone={telephone} />
                    </View>
            }

            <TouchableOpacity style={[styles.nextButton, !isNextButtonEnabled && styles.disabledNextButton]} disabled={!isNextButtonEnabled} onPress={()=> nextStep(true)}>
                <Text style={styles.nextButtonText}> {finishStep ? 'Terminar' : 'Siguiente'}</Text>
            </TouchableOpacity>
        </View>
            <ChooseImageDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)} // Cierra el diálogo
                index={selectedIndex} // Pasa el índice de la imagen
                setImageUris={setImageUris} // Pasa la función para actualizar las imágenes
            />
            </>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '100%',
    },
    modalFinishStep:{
        padding: 20,
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
        marginBottom: 2,
        textAlign: 'center',
        color: "rgba(42, 42, 42, 1)"
    },
    modalContainer: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        color: 'black'
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 10
    },
    sizeButton: {
        borderWidth: 1,
        borderColor: '#000000',
        paddingVertical: 2,
        width: '22%',
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedSizeButton: {
        backgroundColor: '#ADD8E6',
    },
    sizeText: {
        fontSize: 13,
        color: 'black',
        textAlign: 'center'
    },
    selectedSizeText: {
        color: '#000',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#5A5A5A',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    quantityButton: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedQuantityButton: {
        borderColor: '#092C4C',
        backgroundColor: '#fff',
        borderWidth: 2
    },
    quantityText: {
        fontSize: 16,
        color: '#5A5A5A'
    },
    selectedQuantityText: {
        color: '#5A5A5A',
    },
    packageContainer: {
        borderWidth: 1,
        borderColor: '#092C4C',
        marginBottom: 16,
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#b0e0e6',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#092C4C'
    },
    packageTitle: {
        fontSize: 16,
        color: '#000000'
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(208, 208, 208, 1)',
        borderWidth:1,
        width: '48%',
        borderRadius:8,
        marginHorizontal:4,
    },
    inputField: {
        flex: 1, // Se asegura de que el input ocupe todo el espacio disponible
        backgroundColor: 'white',
        paddingLeft: 8, // Añadido para dar más espacio en el texto
        fontSize: 16,
        borderRadius:8,
        marginRight: 10,
    },
    inputFocus: {
        borderColor: '#092C4C', // Cambia el color del borde al hacer foco
        backgroundColor: '#fff', // Mantiene el fondo blanco al hacer foco
    },
    input: {
        borderWidth: 1,
        borderColor: '#B8B8B8',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginHorizontal: 4,
        color: '#5A5A5A'
    },
    imagePlaceholder: {
        height: 100,
        backgroundColor: '#e0e0e0',
        margin: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePlaceholderText: {
        color: '#5A5A5A',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    nextButton: {
        backgroundColor: '#092C4C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginHorizontal: 20,
        marginVertical: 20
    },
    disabledNextButton: {
        backgroundColor: '#B0B0B0', // Gris cuando está deshabilitado
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sizeButtonLastInRow: {
        marginRight: 0,
    },
});