import { StyleSheet, Text, View } from '@react-pdf/renderer';
import SpeciesObject from './speciesObject';

const ReportTable = ({ birdsInfo, birdSpeciesList }) => {

  const speciesObj = SpeciesObject(birdsInfo, birdSpeciesList);
  const keys = Object.keys(speciesObj);
  const values = Object.values(speciesObj);

  const styles = StyleSheet.create({
    table: {
      flexDirection: 'column',
      justifyContent: 'center',
      width: '60%',
      fontFamily: 'Times-Roman',
      marginLeft: 110
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      borderTop: '1px solid #EEE',
      paddingTop: 2,
      paddingBottom: 1,
      fontSize: 11
    },
    rowFewerSpecies: {
      display: 'flex',
      flexDirection: 'row',
      borderTop: '1px solid #EEE',
      paddingTop: 3,
      paddingBottom: 2,
      fontSize: 12
    },
    header: {
      borderTop: 'none',
    },
    bold: {
      fontFamily: 'Times-Bold',
    },
    row1: {
      width: '70%',
      fontSize: 13
    },
    row2: {
      width: '30%',
      fontSize: 13
    },
    odd: {
      backgroundColor: '#D3D3D3',
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 2,
      paddingBottom: 1,
      fontSize: 11
    },
    oddFewerSpecies: {
      backgroundColor: '#D3D3D3',
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 3,
      paddingBottom: 2,
      fontSize: 12
    },
    totalsAtBottom: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 3,
      paddingBottom: 2,
    }
  })

  const printSpecies = () => {
    return keys.map((bird, i) => {
      return (
        <View key={i} style={i % 2 != 0 ? styles.oddFewerSpecies : styles.rowFewerSpecies} wrap={false}>
          <Text style={styles.row1}>{bird}</Text>
          <Text style={[styles.row2, { paddingLeft: 10 }]}>{values[i]}</Text>
        </View>
      )
    })
  }

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text style={[styles.row1, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>Species</Text>
        <Text style={[styles.row2, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>Count</Text>
      </View>
      {printSpecies()}
      <View style={styles.totalsAtBottom}>
        <Text style={[styles.row1, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>Total Individuals</Text>
        <Text style={[styles.row2, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>{values.reduce((sum, a) => sum + a, 0)}</Text>
      </View>
      <View style={styles.totalsAtBottom}>
        <Text style={[styles.row1, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>Total Species</Text>
        <Text style={[styles.row2, styles.bold, { fontSize: 14 }, { paddingBottom: 3 }]}>{keys.length}</Text>
      </View>
    </View>
  )
};

export default ReportTable;