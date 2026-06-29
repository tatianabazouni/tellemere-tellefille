import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function OccasionThemeScreen({ navigation }) {
  const [selectedOccasion, setSelectedOccasion] = useState('Newborn');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const occasions = ['Newborn', 'Baptism', 'Holy Communion', 'Birthday', 'Wedding'];

  const onChangeDate = (event, selected) => {
    if (Platform.OS !== 'web') {
      setShowDatePicker(Platform.OS === 'ios');
    }
    if (selected) setDate(selected);
  };

  const onChangeTime = (event, selected) => {
    if (Platform.OS !== 'web') {
      setShowTimePicker(Platform.OS === 'ios');
    }
    if (selected) setTime(selected);
  };

  const formattedDate = (d) => {
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const formattedTime = (t) => {
    const hh = t.getHours().toString().padStart(2, '0');
    const mm = t.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Tell us about your event</Text>

        {/* Occasion Selection */}
        <Text style={styles.sectionTitle}>Select Occasion</Text>
        <View style={styles.chipsWrap}>
          {occasions.map((o) => {
            const selected = o === selectedOccasion;
            return (
              <TouchableOpacity
                key={o}
                style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
                onPress={() => setSelectedOccasion(o)}
              >
                <Text style={selected ? styles.chipTextSelected : styles.chipText}>{o}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Event Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Name</Text>
          <TextInput
            value={eventName}
            onChangeText={setEventName}
            placeholder="e.g., Baptism of Lea"
            style={styles.textInput}
          />
        </View>

        {/* Date and Time */}
        <View style={styles.rowTwo}>
          {/* Date */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Event Date</Text>
            {Platform.OS === 'web' ? (
              <View style={styles.inputWithIcon}>
                <TextInput
                  type="date"
                  value={formattedDate(date)}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  style={styles.textInputNoIcon}
                />
                <Text style={styles.inputIcon}>📅</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.inputValue}>{formattedDate(date)}</Text>
                <Text style={styles.inputIcon}>📅</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Time */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.sectionTitle}>Event Time</Text>
            {Platform.OS === 'web' ? (
              <View style={styles.inputWithIcon}>
                <TextInput
                  type="time"
                  value={formattedTime(time)}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(':');
                    const newTime = new Date();
                    newTime.setHours(Number(h));
                    newTime.setMinutes(Number(m));
                    setTime(newTime);
                  }}
                  style={styles.textInputNoIcon}
                />
                <Text style={styles.inputIcon}>⏰</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.inputValue}>{formattedTime(time)}</Text>
                <Text style={styles.inputIcon}>⏰</Text>
              </TouchableOpacity>
            )}
            {showTimePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('TableDesign')}
        >
        <Text style={styles.ctaText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = '#eb4770';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  container: { padding: 16, paddingBottom: 100 },
  header: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipSelected: { backgroundColor: 'rgba(235,71,112,0.12)', borderColor: PRIMARY },
  chipUnselected: { backgroundColor: 'transparent', borderColor: '#D1D5DB' },
  chipText: { fontSize: 14, fontWeight: '600' },
  chipTextSelected: { fontSize: 14, fontWeight: '600', color: PRIMARY },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  textInputNoIcon: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
    fontSize: 15,
  },
  inputIcon: { fontSize: 18, opacity: 0.7 },
  inputValue: { fontSize: 15 },
  rowTwo: { flexDirection: 'row', marginTop: 16 },
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
