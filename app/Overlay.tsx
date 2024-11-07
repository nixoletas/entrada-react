import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

export const Overlay = () => {
  return (
    <Canvas
        style={StyleSheet.absoluteFill}
        onDraw={(canvas: { clear: (arg0: number) => any; }) => {
            return canvas.clear(0xffffffff);
        }}
>
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
    </Canvas>
  );
};