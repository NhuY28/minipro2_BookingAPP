import { View } from "react-native";
import { styles } from "../styles";

export function RoomSkeleton() {
  return (
    <View style={styles.roomSkeleton}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonLines}>
        <View style={styles.skeletonLineLong} />
        <View style={styles.skeletonLineShort} />
      </View>
      <View style={styles.skeletonFooter} />
    </View>
  );
}
