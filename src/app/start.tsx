import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import { Save2, CloseSquare, Magicpen, Share, Gallery, Text as TextIcon, Link, Camera } from 'iconsax-react-native';

import { Button, ModeCard, FocusAwareStatusBar, Input, SafeAreaView, Text as TextComponent, View, Modal, useModal } from '@/components/ui';


type GenerationMode = 'text' | 'url' | 'image' | 'contact';

export default function QRGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text');
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const qrRef = useRef(null);
  
  const { ref: modalRef, present, dismiss } = useModal();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      return result.assets[0].base64;
    }
    return null;
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      return result.assets[0].base64;
    }
    return null;
  };

  const generateQR = async () => {
    if (generationMode === 'image') {
      if (!selectedImage) {
        alert('📸 Oups! Veuillez sélectionner une image');
        return;
      }
      setQrValue(selectedImage);
    } else if (!inputText.trim()) {
      alert('✏️ Oups! Veuillez entrer un texte ou URL');
      return;
    } else {
      setQrValue(inputText);
    }
    present();
    startAnimation();
  };

  const clearAll = () => {
    setInputText('');
    setQrValue('');
    setSelectedImage(null);
    dismiss();
  };

  const startAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    rotateAnim.setValue(0);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const shareQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const saveToGallery = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri, { dialogTitle: 'Enregistrer le QR Code' });
    } catch (error) {
      console.error('Error saving QR code:', error);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <FocusAwareStatusBar />
      
      <TextComponent className="mb-6 text-2xl font-bold text-center text-gray-800">
        ✨ Générateur QR Code 
      </TextComponent>
      
      <TextComponent className="mb-3 text-lg font-semibold">🎯 Type de contenu</TextComponent>
      <View className="flex-row mb-4">
        <ModeCard 
          icon={TextIcon} 
          title="Texte " 
          mode="text"
          description="Générer à partir d'un texte" 
          currentMode={generationMode}
          onPress={(mode) => setGenerationMode(mode as GenerationMode)}
        />
        <ModeCard 
          icon={Link} 
          title="URL 🔗" 
          mode="url"
          description="Générer à partir d'un lien" 
          currentMode={generationMode}
         onPress={(mode) => setGenerationMode(mode as GenerationMode)}
        />
      </View>
      <View className="flex-row mb-6">
        <ModeCard 
          icon={Gallery} 
          title="Image 🖼️" 
          mode="image"
          description="Générer à partir d'une image" 
          currentMode={generationMode}
           onPress={(mode) => setGenerationMode(mode as GenerationMode)}
        />
        <ModeCard 
          icon={Camera} 
          title="Contact 👤" 
          mode="contact"
          description="Générer une carte de contact" 
          currentMode={generationMode}
          onPress={(mode) => setGenerationMode(mode as GenerationMode)}
        />
      </View>

      {generationMode === 'image' ? (
        <View className="mb-6">
          {selectedImage ? (
            <View className="items-center mb-4">
              <Image 
                source={{ uri: selectedImage }} 
                className="w-32 h-32 rounded-lg mb-2" 
              />
              <Button
                label="🔄 Changer d'image"
                onPress={pickImage}
                variant="outline"
                className="mb-2"
                size="sm"
              />
            </View>
          ) : (
            <View className="flex-row justify-between">
              <Button
                label="Importer une image"
                onPress={pickImage}
                className="flex-1 mr-2 rounded-3xl"
                size="sm"
                icon={<Gallery variant="Bold" size="16" color="white" className="mr-1" />}
              />
              <Button
                label="Prendre une photo"
                onPress={takePhoto}
                className="flex-1 ml-2 rounded-3xl"
                size="sm"
                icon={<Camera variant="Bold" size="16" color="white" className="mr-1" />}
              />
            </View>
          )}
        </View>
      ) : (
        <Input
          label={generationMode === 'url' ? "🔗 Entrez votre URL" : "📝 Entrez votre texte"}
          placeholder={generationMode === 'url' ? "Ex: https://obytes.com" : "Ex: Mon texte secret"}
          value={inputText}
          onChangeText={setInputText}
          className="mb-4 bg-white h-12 rounded-xl px-4"
          keyboardType={generationMode === 'url' ? 'url' : 'default'}
        />
      )}
      
      <View className="flex-row justify-between mb-6">
        <Button
          label="Générer"
          onPress={generateQR}
          disabled={(generationMode !== 'image' && !inputText.trim()) || (generationMode === 'image' && !selectedImage)}
          className="flex-1 mr-2 bg-blue-500 rounded-xl"
          textClassName="text-white"
          icon={<Magicpen variant="Bold" size="20" color="white" className="mr-2" />}
        />
        <Button
          label="Effacer"
          onPress={clearAll}
          variant="outline"
          className="flex-1 ml-2 rounded-xl border-gray-200"
          icon={<CloseSquare variant="Bold" size="20" color="#ef4444" className="mr-2" />}
        />
      </View>
      
      <Modal
        ref={modalRef}
        snapPoints={['65%']}
        title="Votre QR Code est prêt ! 🎉"
        detached={true}
        onDismiss={clearAll}
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate }
            ],
          }}
          className="p-4 items-center"
        >
          <View ref={qrRef} className="p-6 bg-white rounded-2xl shadow-lg mb-4">
            <QRCode 
              value={qrValue} 
              size={180}
              backgroundColor="white"
              color="black"
            />
          </View>
          
          <View className="flex-row mt-4 w-full px-4 gap-3">
            <Button
              label="Partager"
              onPress={shareQRCode}
              size="md"
              className="flex-1 bg-blue-500"
              icon={<Share variant="Bold" size="20" color="white" className="mr-2" />}
            />
            <Button
              label="Enregistrer"
              onPress={saveToGallery}
              size="md"
              className="flex-1 bg-green-500"
              icon={<Save2 variant="Bold" size="20" color="white" className="mr-2" />}
            />
          </View>
        </Animated.View>
      </Modal>
      
      <SafeAreaView />
    </View>
  );
}