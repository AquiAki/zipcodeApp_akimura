import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Button } from "react-native";
import { isTemplateSpan } from "typescript";

const apiBaseURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function ZipCodeApp() {
  const [zipcode, setZipcode] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const loadingView = <Text>loading</Text>;
  

  const updateScreenAsync = async () => {
    setIsLoading(true); //読み込み中にする

    try {
      const address: string[] = await getAddressInfoAsync(zipcode);
      setAddresses(address);

      
    } catch (error) {
      alert(error);
    }

    setIsLoading(false);
  };

  const getAddressInfoAsync = async (zipcode: string) => {

    const uri = apiBaseURL + "?zipcode=" + zipcode;

    const responce = await axios(uri);
    //レスポンスの最初のものをdataとして格納;
    const addresses = responce.data.results;
    console.log(addresses);
    return addresses;
  };

  


  const renderAddressItem = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <Text>
        {item.address1}
        {item.address2}
        {item.address3}
      </Text>
    );
  };

  const getAddress = (
    <View>
      <FlatList
        data={addresses}
        keyExtractor={(item, index: any) => String(index)}
        renderItem={renderAddressItem}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          style={styles.addressText}
          placeholder="郵便番号を入力せよ"
          onChangeText={(text) => setZipcode(text)}
          // keyboardType="numeric"
        />
      </View>
      <View style={styles.inputs}>
        <TouchableOpacity style={styles.button} onPress={updateScreenAsync}>
          <Text style={styles.buttonText}>住所を取得</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addressView}>
        {isLoading ? loadingView : getAddress}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    flex: 0.3,
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },

  addressText: {
    textAlign: "center",
    width: 180,
    height: 50,
    borderWidth: 3,
    borderColor: "#008080",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",

    fontSize: 20,
  },

  button: {
    
    width: 200,
    height: 60,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "white",

    backgroundColor: "#660000",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    color: "white",
  },
  addressView: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    bottom: "0%",
    fontSize: 30,
  },
});
