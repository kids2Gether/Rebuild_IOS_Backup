import React, { useContext } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { styles } from './styles'
import { AppContext } from '../../../../contexts/AppContext'
import CustomButton from '../../../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

export default function CreatePin() {
    const { setPinController } = useContext(AppContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header_content}>
                <Text style={styles.header_title}>CRIAR UM LOCAL</Text>
            </View>
            <View style={styles.main_content}>
                <Text style={[styles.main_text]}>Você precisa se CADASTRAR para utilizar esse recurso do App.</Text>
                <Text style={[styles.main_text, { color: '#538CAE' }]}>Não se preocupe, VOCÊ NÃO PAGA NADA por isso e seus locais não serão compartilhados com ninguém.</Text>
            </View>
            <View style={styles.footer_content}>
                <CustomButton value={"LOGAR ou CRIAR CONTA"} onPress={() => {setPinController(false); navigation.navigate('profile-routes', { screen: 'login' })}} />
                <Text style={styles.actions_back_text} onPress={() => setPinController(false)}>CONTINUAR SEM CONTA</Text>
            </View>
        </View>
    )
}
