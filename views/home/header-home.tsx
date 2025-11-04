import { ThemedText } from '@/components/themed-text';
import { TOKENS } from '@/constants/colors';
import { useAuth } from '@/hooks/use-auth';
import { useWeather } from '@/hooks/use-weather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const HeaderHome = () => {

  const { user } = useAuth();
  const { weather, isLoading } = useWeather();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={{ uri: user?.character?.image_url }}
          style={styles.avatar}
        />
        <View style={styles.headerLeftTextContainer}>
          <View style={styles.headerLocation}>
            <MaterialIcons name="location-on" size={16} color={TOKENS.navActive} />
            <ThemedText type="default">La Plata</ThemedText>
          </View>
          <ThemedText type="defaultSemiBold">Hola {user?.display_name || user?.username}</ThemedText>
        </View>
      </View>

      <View style={styles.headerRight}>
        {isLoading ? null :
          <>
            <View style={styles.headerRightWeather}>
              {weather?.wm.icon}
              <ThemedText type="defaultSemiBold">{weather?.temperature}°C</ThemedText>
            </View>
            <ThemedText type="default">{weather?.wm.label}</ThemedText>
          </>
        }
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftTextContainer: {
    gap: 4,
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerRightWeather: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
  },
});

export default HeaderHome;