import LocationMapBlock from "@/components/LocationMapBlock";
import {
  findUsFromPage,
  pageHasGoogleMap,
  type CmsPage,
} from "@/lib/cms";

export default function PageLocationMap({
  page,
}: {
  page: CmsPage | null;
}) {
  if (!pageHasGoogleMap(page)) return null;

  const findUs = findUsFromPage(page);
  if (!findUs) return null;

  return <LocationMapBlock findUs={findUs} />;
}
