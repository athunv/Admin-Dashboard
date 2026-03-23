import { Helmet } from "react-helmet-async";

export default function PageTitle({ title }) {
  return (
    <Helmet>
      <title>{title ? `A2Hun / ${title}` : "A2Hun Admin"}</title>
    </Helmet>
  );
}