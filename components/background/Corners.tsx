import Image from "next/image";

export default function Corners() {
  return (
    <>
      <Image
        src="/ornaments/corner-tl.png"
        alt=""
        width={260}
        height={260}
        className="absolute top-0 left-0 opacity-70 pointer-events-none"
      />

      <Image
        src="/ornaments/corner-tr.png"
        alt=""
        width={260}
        height={260}
        className="absolute top-0 right-0 opacity-70 pointer-events-none"
      />

      <Image
        src="/ornaments/corner-bl.png"
        alt=""
        width={260}
        height={260}
        className="absolute bottom-0 left-0 opacity-70 pointer-events-none"
      />

      <Image
        src="/ornaments/corner-br.png"
        alt=""
        width={260}
        height={260}
        className="absolute bottom-0 right-0 opacity-70 pointer-events-none"
      />
    </>
  );
}