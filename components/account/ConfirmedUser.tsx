type ConfirmedUserProps = {
  userData: {
    name: string;
    // add other fields as needed
  };
};

export default function ConfirmedUser({ userData }: ConfirmedUserProps) {
  return (
    <div className="space-y-4">
      <p>✅ Contul tău este confirmat!</p>
      <p>
        📝 În curând vei primi mai multe informații despre tabără și următorii
        pași.
      </p>
    </div>
  );
}
