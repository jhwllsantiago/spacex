export default function Launch({ data }) {
  return (
    <li className="launch">
      <div className="box">X</div>
      <div className="details">
        <p>
          {data.flight_number}: {data.name?.trim()} {new Date(data.date_local).getFullYear()}
        </p>
        <p>{data?.details?.trim() || "No details"}</p>
      </div>
    </li>
  );
}
