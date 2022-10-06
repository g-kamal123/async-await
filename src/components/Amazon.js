import {
  Button,
  Card,
  Layout,
  Select,
  SkeletonBodyText,
  SkeletonPage,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useFetch } from "./FetchHook";
import { v4 as uuid } from "uuid";

const Amazon = () => {
  const [_post] = useFetch(
    "https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/"
  );

  const [_post1] = useFetch(
    "https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/"
  );

  const [count, setCount] = useState([]);
  const [subopts, setSubopts] = useState([]);
  const [subselected, setsubselected] = useState([]);
  const [payload1, setPayload] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [category,setCategory] = useState()
  // const [allSelects, setAllselects] = useState(0);
  const [alloptions, setAllOptions] = useState([]);
  const [flag, setFlag] = useState(false);
  const handleSelectChange = (value, i) => {
    // console.log(i);
    let val = JSON.parse(value);
    // console.log(val);
    if (val[1]) {
      setPayload(val[0]);
      setFlag(false);
      setCount([]);
      setSubopts([]);
      setsubselected([]);
    }
    let arr = [...selected];
    arr = arr.filter((item, index) => index <= i);
    // console.log(arr);
    arr[i] = value;
    setSelected(arr);
    let arr1 = [...alloptions];
    arr1 = arr1.filter((item, index) => index <= i);
    setAllOptions(arr1);
    if (!val[1]) {
      setFlag(true);
      getAttributes(val[2]);
    }
  };

  const getAttributes = async (para) => {
    const payload = {
      target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
      user_id:"63329d7f0451c074aa0e15a8",
      data: {
        barcode_exemption: false,
        browser_node_id: "1380072031",
        category: para["primary-category"],
        sub_category: para["sub-category"],
      },
      source: {
        marketplace: "shopify",
        shopId: "500",
      },
      target: {
        marketplace: "amazon",
        shopId: "530",
      },
    };
    setLoading(true);
    const ftch = await _post1(payload);
    let arr1 = [];
    for (const i in ftch.data) {
      for (const j in ftch.data[i])
        if (!arr1.includes(ftch.data[i][j]["label"].replace(" ", "_")))
          arr1 = [...arr1, ftch.data[i][j]["label"].replace(" ", "_")];
    }
    // const arr1 = Object.keys(ftch.data[])
    const opts = arr1.map((item) => {
      return {
        label: item,
        value: item,
        disabled: false,
      };
    });
    setSubopts(opts);
    setLoading(false);
    // setsubselected([opts[0].value])
    // console.log(arr1);
  };

  useEffect(() => {
    const getData = async () => {
      const payload = {
        target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        selected: payload1,
        user_id:"63329d7f0451c074aa0e15a8",
        target: {
          marketplace: "amazon",
          shopId: "530",
        },
      };
      setLoading(true);
      const ftch = await _post(payload);
      if (!ftch.success) {
        setLoading(false);
        // alert(ftch.message);
        return;
      }
      // console.log(ftch.data)
      if (ftch.data) {
        // setAllselects((prev) => prev + 1);
        let arr1 = ftch.data.map((item) => {
          return {
            label: item.name,
            value: JSON.stringify([
              item.parent_id,
              item.hasChildren,
              item.category,
            ]),
          };
        });
        setAllOptions([...alloptions, arr1]);
        setSelected([...selected, arr1[0].value]);
        setLoading(false);
      }
    };
    getData();
  }, [payload1]);
  // console.log(alloptions);

  const addAttribute = () => {
    let arr1 = [...count, { id: uuid() }];
    setCount(arr1);
    let sel = [...subselected, ""];
    setsubselected(sel);
    let arr = [...subopts];
    for (let i = 0; i < arr.length; i++) {
      if (subselected.includes(arr[i].value)) {
        arr[i].disabled = true;
      } else arr[i].disabled = false;
    }
    setSubopts(arr);
  };
  const SelectChange = (e, i) => {
    let arr = [...subselected];
    arr[i] = e;
    setsubselected(arr);
    let arr2 = [...subopts];
    for (let i = 0; i < arr2.length; i++) {
      if (arr.includes(arr2[i].value)) {
        arr2[i].disabled = true;
      } else arr2[i].disabled = false;
    }
    setSubopts(arr2);
  };
  const deleteHandler = (val, index) => {
    let arr = count.filter((item) => item.id !== val);
    setCount(arr);
    let arr1 = subselected.filter((item, i) => i !== index);
    console.log(arr1);
    setsubselected(arr1);
    let arr2 = [...subopts];
    for (let i = 0; i < arr2.length; i++) {
      if (arr1.includes(arr2[i].value)) {
        arr2[i].disabled = true;
      } else arr2[i].disabled = false;
    }
    setSubopts(arr2);
  };
  return (
    <>
      <Card>
        {selected.map((item, i) => (
          <Select
            options={alloptions[i]}
            onChange={(e) => handleSelectChange(e, i)}
            value={selected[i]}
            key={i}
          />
        ))}
      </Card>
      {flag && !loading && (
        <>
          <Card sectioned>
            {count.map((item, i) => (
              <Card key={item.id}>
                <Select
                  options={subopts}
                  onChange={(e) => SelectChange(e, i)}
                  value={subselected[i]}
                  // key={item}
                  placeholder={"--select--"}
                />
                <TextField />
                <Button onClick={() => deleteHandler(item.id, i)}>
                  Delete
                </Button>
              </Card>
            ))}
          </Card>
          <Button onClick={addAttribute}>Add Opional Attributes</Button>
        </>
      )}
      {loading && (
        <SkeletonPage primaryAction>
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonBodyText />
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      )}
    </>
  );
};

export default Amazon;
