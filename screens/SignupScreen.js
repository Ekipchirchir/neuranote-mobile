import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { globalStyles } from '../styles/global';

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Signup</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
        <Text style={globalStyles.buttonText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={globalStyles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignupScreen;
