import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RentHeader } from "../../../components/header";
import { RentDescription } from "../../../components/info";
import {
    SegmentedTabs,
    type SegmentedTab,
} from "../../../components/ui/segmented-tabs";
import { Palette } from "../../../themes/themes";
import {
    MarketplaceSection,
    MyOfferingsSection,
    RequestsSection,
} from "../components/sections";

type Sections = "MARKETPLACE" | "MY-REQUESTS" | "RECEIVED" | "MY-OFFERINGS";

const TABS: SegmentedTab<Sections>[] = [
    { label: "Explorar", value: "MARKETPLACE" },
    { label: "Mis solicitudes", value: "MY-REQUESTS" },
    { label: "Recibidas", value: "RECEIVED" },
    { label: "Mis ofertas", value: "MY-OFFERINGS" },
];

export default function PropertyServiceScreen() {
    const [section, setSection] = useState<Sections>("MARKETPLACE");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Palette.background }}>
            <RentHeader sectionName="Prestacion de Servicios" />
            <RentDescription
                title="Servicios"
                description="Explora ofertas, solicita servicios para tus inmuebles y gestiona tus solicitudes."
            />
            <SegmentedTabs tabs={TABS} value={section} onChange={setSection} />
            <View style={{ flex: 1 }}>
                {section === "MARKETPLACE" && <MarketplaceSection />}
                {section === "MY-REQUESTS" && <RequestsSection role="requester" />}
                {section === "RECEIVED" && <RequestsSection role="provider" />}
                {section === "MY-OFFERINGS" && <MyOfferingsSection />}
            </View>
        </SafeAreaView>
    );
}
