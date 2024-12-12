type PendingUserProps = {
  userData: {
    phone: string;
  };
};

export default function PendingUser({ userData }: PendingUserProps) {
  return (
    <div className="space-y-4">
      <p>✅ Am primit datele tale de înregistrare.</p>
      <p>
        📲 Vei primi un mesaj pe Whatsapp la numărul tău {userData.phone} cu{" "}
        <strong>confirmarea</strong> din partea noastră. Atunci vei avea acces
        și la <strong>contul tău</strong>.
      </p>
      <p>
        👤 Dacă sunt probleme poți lua legatura cu noi la numărul de telefon{" "}
        <a
          href="tel:+40773311577"
          className="text-hope-darkcyan hover:underline"
        >
          0773 311 577
        </a>
      </p>
    </div>
  );
}
