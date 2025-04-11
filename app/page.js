import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className="text-3xl font-bold underline">
      Validation Form With Zod
    </h1>
    </div>
  );
}
