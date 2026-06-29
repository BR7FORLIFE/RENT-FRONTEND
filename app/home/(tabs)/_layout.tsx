import { Tabs } from "expo-router";
import ContractIcon from "../../../assets/icons/contract-tab.svg";
import FinancialReportIcon from "../../../assets/icons/financial-report-tab.svg";
import InvoiceIcon from "../../../assets/icons/invoice-tab.svg";
import RegisterPropertyIcon from "../../../assets/icons/property-registration-tab.svg";
import PropertyServiceIcon from "../../../assets/icons/property-services-tab.svg";

export default function TabContainer() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="property-registration"
        options={{
          title: "Propiedades",
          tabBarIcon: ({ size }) => (
            <RegisterPropertyIcon width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="contract"
        options={{
          title: "Contratos",
          tabBarIcon: ({ size }) => <ContractIcon width={size} height={size} />,
        }}
      />
      <Tabs.Screen
        name="finance-reports"
        options={{
          title: "Finanzas",
          tabBarIcon: ({ size }) => (
            <FinancialReportIcon width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="properties-services"
        options={{
          title: "Servicios",
          tabBarIcon: ({ size }) => (
            <PropertyServiceIcon width={size} height={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="public-services"
        options={{
          title: "Facturas",
          tabBarIcon: ({ size }) => <InvoiceIcon width={size} height={size} />,
        }}
      />
    </Tabs>
  );
}
