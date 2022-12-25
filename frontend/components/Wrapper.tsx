import { CSSProperties, FC } from "react";

type Props = {
  layout: "small" | "medium" | "large";
  style?: CSSProperties;
};

const Wrapper: FC<Props> = ({ children, layout, style }) => {
  return (
    <div
      style={{
        maxWidth:
          layout === "small" ? "40%" : layout === "medium" ? "70%" : "100%",
        margin: "auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export default Wrapper;
