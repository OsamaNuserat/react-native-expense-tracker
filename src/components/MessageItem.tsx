import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('MessageDetails', { id: message.id.toString() });
  };

  const parsedData = message.parsedData;
  const isProcessed = !!parsedData;

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={[styles.card, isProcessed && styles.processedCard]}>
        <Card.Content>
          <Text style={styles.content} numberOfLines={3}>
            {message.content}
          </Text>
          
          {parsedData && (
            <View style={styles.parsedInfo}>
              <View style={styles.row}>
                <Chip 
                  mode="outlined" 
                  textStyle={styles.chipText}
                  style={[
                    styles.chip, 
                    parsedData.type === 'income' ? styles.incomeChip : styles.expenseChip
                  ]}
                >
                  {parsedData.type === 'income' ? '+' : '-'}JD {parsedData.amount}
                </Chip>
                
                {parsedData.merchant && (
                  <Chip 
                    mode="outlined" 
                    textStyle={styles.chipText}
                    style={styles.chip}
                  >
                    {parsedData.merchant}
                  </Chip>
                )}
              </View>
              
              <View style={styles.row}>
                <Chip 
                  mode="outlined" 
                  textStyle={styles.chipText}
                  style={styles.categoryChip}
                >
                  {parsedData.category}
                </Chip>
                
                {parsedData.source && (
                  <Chip 
                    mode="outlined" 
                    textStyle={styles.chipText}
                    style={styles.sourceChip}
                  >
                    {parsedData.source}
                  </Chip>
                )}
              </View>
            </View>
          )}

          <Text style={styles.date}>
            {new Date(message.createdAt).toLocaleString()}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 12,
  },
  processedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  content: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 22,
  },
  parsedInfo: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#1E1E1E',
  },
  incomeChip: {
    borderColor: '#4CAF50',
  },
  expenseChip: {
    borderColor: '#FF5722',
  },
  categoryChip: {
    borderColor: '#FF6384',
  },
  sourceChip: {
    borderColor: '#36A2EB',
  },
  chipText: {
    color: '#FFF',
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'right',
  },
});
