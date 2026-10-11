import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import { EmptyList, RentDescription } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { Palette } from "../../../../themes/themes";
import { GetPublishedProperties } from "../../api";
import { FeedCard } from "../../components/feed/feed-card";

const FEED_PAGE_SIZE = 10;

export function FeedScreen() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["publishedProperties"],
    queryFn: ({ pageParam }) =>
      GetPublishedProperties(pageParam, FEED_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.metadata.hasNextPage ? last.metadata.page + 1 : undefined,
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="No pudimos cargar los inmuebles publicados." />;
  }

  const properties = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <SafeAreaView style={styles.screen}>
      <RentHeader sectionName="FEED" />

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedCard
            property={item}
            onPress={() =>
              router.push({
                pathname: "/property/feed/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.title}>
            <RentDescription
              title="Inmuebles disponibles"
              description="Explora las propiedades publicadas por sus dueños."
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyList
            title="Aún no hay inmuebles publicados"
            description="Cuando un dueño publique su inmueble, aparecerá aquí."
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={Palette.accent} style={styles.loader} />
          ) : null
        }
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        refreshing={isRefetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  list: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },

  // RentDescription ya trae su propio padding horizontal de 20
  title: {
    marginHorizontal: -20,
  },

  loader: {
    paddingVertical: 16,
  },
});
