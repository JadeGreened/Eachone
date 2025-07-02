import { motion } from "framer-motion";

export default function MotionTest() {
  return (
    <motion.div
      style={{
        width: 80,
        height: 80,
        background: "hotpink",
        borderRadius: 16,
        margin: 40,
      }}
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 300, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}
