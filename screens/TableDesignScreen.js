import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const stylesData = [
  {
    id: 1,
    name: 'Minimalist',
    description: 'Modern & clean',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQiZo_XEk-tjuSrNeHYHVv9xWs2_YyifY0g34v_ut9Sq_prfzoxnqRzNx5VDAPcBsULTsOvER_LN0Q7VtUWatn2k0WhZwSyeBkyBQ3hBq1oucUNBUx-wuquMwapaFpUjiEtrptavCOwH-l2WlmtSO6ezqHhK9qOiu6FsKbG4le0LN3kQ88-z-bdNApWHKDcVWdiUmHztBh-QPFzXqXCjd--Fzeje_QMbTklMID2w60GQbkuz1xQBoBTPiv0ElrnwhUgF-J4WDAqjyl',
  },
  {
    id: 2,
    name: 'Boho',
    description: 'Earthy & free-spirited',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeTOeCjcV9wOORWOF4jt1UI_gVIlL07Y9hR2XNsOyb-xCkalhW5w75eN41J-vlOa3qnXiQqPUZUShySAywnLDIW25JvjxLZi02NdB-x_HEKh74mks0TsAfZgQDwDw_p6DNXCL9-TpfE1WlJRNw71Zz6gfm6NolWIUT6YETLhadiBy2WM-t_K_WzLH1RFAb7P2HQakGbKjZ-81PDGP-OsM83K9o4Ou4JjqTUdBNMFCHfYUgTrz2XLOhSxQYJk-Vyx0VucpJvO-Bo5OO',
  },
  {
    id: 3,
    name: 'Classic Religious',
    description: 'Timeless & elegant',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIhWv-KgtjU9kRrAj0XtN7jP_odlut_KYQB0-tk-PFOMwgGge-SjliOZ9C0Leeea2TiQs0Eq-ZwpH0P2_SttikGdtr788-FVvZlWyFVtDnQua8n3XwnrhXFOs8LuKJMOY0q3ycWDZfEGdB44b9_WI1mYLkyLbOqWi_EcJO_TBQQ4T7t55_C5izcH_4z26KxBGDa7ADbNr07bDrdWI1iihtvRPO-Hw_NXRy8ozcpzXi3y3EvDiYow01KvaUzaHzI9_zIWHpq1o2pk0J',
  },
];

const colorPalettes = [
  { name: 'Rose Gold & Blush', colors: ['#E6A4B4', '#F3D7CA', '#B0828D', '#FFF8E3'] },
  { name: 'Ivory & Gold', colors: ['#F8F4E1', '#AF8F6F', '#D4AF37', '#543310'] },
  { name: 'Earthy Neutrals', colors: ['#A9B388', '#5F6F52', '#E9E6D7', '#B99470'] },
  { name: 'Pastel Dream', colors: ['#FDF0F0', '#DBAFA0', '#A5C0DD', '#E9E6D7'] },
];

const enhancementsData = ['Fresh Flowers', 'Elegant Candles', 'Personalized Boxes'];
const PRIMARY = '#eb4770';
const totalSteps = 5;
const currentStep = 1; // first page

export default function TableDesignScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tableDesignData } = route.params || {};

  const [selectedStyle, setSelectedStyle] = useState(tableDesignData?.styleId || stylesData[0].id);
  const [selectedPalette, setSelectedPalette] = useState(tableDesignData?.palette || colorPalettes[0].name);
  const [enhancements, setEnhancements] = useState(
    enhancementsData.reduce(
      (acc, e) => ({ ...acc, [e]: tableDesignData?.enhancements?.[e] ?? true }),
      {}
    )
  );

  const toggleEnhancement = (name) => {
    setEnhancements({ ...enhancements, [name]: !enhancements[name] });
  };

  const handleNext = () => {
    navigation.navigate('QuantityBudget', {
      ...route.params,
      tableDesignData: {
        styleId: selectedStyle,
        palette: selectedPalette,
        enhancements: enhancements,
      },
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Progress Indicator */}
      <View style={progressStyles.indicators}>
        {[...Array(totalSteps)].map((_, i) => (
          <View key={i} style={progressStyles.indicatorOuter}>
            <View
              style={[
                progressStyles.indicatorInner,
                i < currentStep ? progressStyles.activeIndicator : progressStyles.inactiveIndicator,
              ]}
            />
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Live Preview */}
        <Text style={styles.sectionTitle}>Live Preview</Text>
        <View style={styles.previewCard}>
          <Image
            source={{ uri: stylesData.find((s) => s.id === selectedStyle).image }}
            style={styles.previewImage}
          />
          <Text style={styles.previewDescription}>
            {stylesData.find((s) => s.id === selectedStyle).description}
          </Text>
        </View>

        {/* Choose Style */}
        <Text style={styles.sectionTitle}>Choose a Style</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {stylesData.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[styles.styleCard, selectedStyle === style.id && styles.styleCardSelected]}
              onPress={() => setSelectedStyle(style.id)}
            >
              <Image source={{ uri: style.image }} style={styles.styleImage} />
              <Text style={styles.styleName}>{style.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Color Palette */}
        <Text style={styles.sectionTitle}>Select a Color Palette</Text>
        {colorPalettes.map((palette) => (
          <TouchableOpacity
            key={palette.name}
            style={[styles.paletteCard, selectedPalette === palette.name && styles.paletteCardSelected]}
            onPress={() => setSelectedPalette(palette.name)}
          >
            <View style={styles.paletteColors}>
              {palette.colors.map((c, i) => (
                <View key={i} style={[styles.colorBox, { backgroundColor: c }]} />
              ))}
            </View>
            <Text style={styles.paletteName}>{palette.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Enhancements */}
        <Text style={styles.sectionTitle}>Enhancements</Text>
        {enhancementsData.map((e) => (
          <View key={e} style={styles.enhancementRow}>
            <Text style={styles.enhancementText}>{e}</Text>
            <Switch
              value={enhancements[e]}
              onValueChange={() => toggleEnhancement(e)}
              thumbColor={enhancements[e] ? PRIMARY : '#f4f3f4'}
            />
          </View>
        ))}

        {/* Next Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  container: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginVertical: 12 },
  previewCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  previewImage: { width: '100%', height: 200 },
  previewDescription: { padding: 8, fontSize: 14, color: '#555' },
  horizontalScroll: { marginBottom: 16 },
  styleCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  styleCardSelected: { borderColor: PRIMARY },
  styleImage: { width: '100%', height: 80 },
  styleName: { textAlign: 'center', marginTop: 4 },
  paletteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },
  paletteCardSelected: { borderColor: PRIMARY },
  paletteColors: { flexDirection: 'row', gap: 4 },
  colorBox: { width: 20, height: 20, borderRadius: 4 },
  paletteName: { marginLeft: 8, fontWeight: '600' },
  enhancementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  enhancementText: { fontWeight: '600' },
  ctaButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});

// --- Progress Indicator Styles ---
const progressStyles = StyleSheet.create({
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  indicatorOuter: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: '#e0e0e0',
  },
  indicatorInner: { height: 4, borderRadius: 2 },
  activeIndicator: { backgroundColor: PRIMARY },
  inactiveIndicator: { backgroundColor: '#e0e0e0' },
});
