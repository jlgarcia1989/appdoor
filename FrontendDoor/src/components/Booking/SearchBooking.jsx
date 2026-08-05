import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { Image, SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { logo_not_found } from '../../utils/Logo';

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState([
        { id: '1', name: 'Bogotá', address: 'Carrera 7 # 44-103' },
        { id: '2', name: 'Medellin', address: 'Carrera 7 # 44-103' },
    ]);

    const handleSearch = text => {
        setSearchQuery(text);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TouchableOpacity style={{ margin: 15 }} onPress={() => { }}>
                    <Icon name="map-marker" size={20} color="rgba(65, 65, 65, 1)" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    placeholder="Escribe una ubicacion"
                    placeholderTextColor='rgba(184, 184, 184, 1)'
                />
               {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        <Icon name="close" size={20} color="rgba(184, 184, 184, 1)" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.title}>
                <Text style={styles.textTitle}>
                    {searchQuery ? `Resultados para: '${searchQuery}'` : 'Lugares Recientes'}
                </Text>
                <Text style={styles.clearText} onPress={clearSearch}>
                    {searchQuery ? `Resultados: ${filteredPlaces.length}` : 'Borrar'}
                </Text>
            </View>
            {
                filteredPlaces.length > 0 ?

                    <FlatList
                        data={filteredPlaces}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.placeItem}>
                                <Text style={styles.placeName}>{item.name}</Text>
                                <Text style={styles.placeDetails}>{item.address}</Text>
                            </View>
                        )}
                    /> :

                    (

                        <View style={styles.notFound}>
                            <SvgXml
                                xml={logo_not_found}
                                style={styles.logo}
                                fill="white"
                            />
                            <Text style={styles.message}>No se han encontrado resultados</Text>
                            <Text style={styles.desciption}>Lo sentimos, no se ha encontrado la palabra clave que ha introducido. Vuelva a comprobarlo o busque con otra palabra clave.</Text>
                        </View>
                    )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(173, 216, 230, 0.3)',
        borderRadius: 8,
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(9, 44, 76, 1)'
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: 'rgba(51, 51, 51, 1)',
    },
    clearButton: {
        padding: 10,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    textTitle: {
        color: 'rgba(90, 90, 90, 1)',
        fontSize: 16
    },
    clearText: {
        color: 'rgba(226, 185, 59, 1)',
        fontSize: 16
    },
    placeItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    placeName: {
        fontSize: 16,
        color: 'rgba(90, 90, 90, 1)',
    },
    placeDetails: {
        fontSize: 14,
        color: 'rgba(184, 184, 184, 1)',
    },
    placeDistance: {
        fontSize: 14,
        color: '#666',
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    message: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    },
    desciption: {
        fontSize: 14,
        color: '#333',
    },
});

export default SearchComponent;
