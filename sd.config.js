const expandToken = (token, nameTransformer) => {
  // 如果 token.value 不是對象，則直接返回 token
  if (typeof token.value !== "object") {
    return token;
  }

  // 獲取 token 的其他屬性，包括 attributes、name、path、value、...rest
  const { attributes, name, path, value: _value, ...rest } = token;

  // 遍歷 token.value 的所有 key-value 對
  return Object.entries(token.value).map(([key, value]) => {
    // 生成 childPath，它是 path 的一個拷貝，並在最後追加 key
    const childPath = [...path, key];

    // 使用 nameTransformer 函數生成 childName
    const childName = nameTransformer({
      ...token,
      path: childPath,
    });

    // 返回一個新的 token，它包含了 token 的其他屬性，以及 childName、childPath 和 value
    return {
      ...rest,
      ...(attributes ? { attributes: { ...attributes, subitem: key } } : {}),
      name: childName,
      path: childPath,
      value,
    };
  });
};

module.exports = {

    
  source: ["MyStyleD/tokens/figma-tokens.json"],

  format: {
    test: ({ dictionary }) => {
      // Create a shallow copy - we'll create new tokens in `allTokens|allProperties` when expanding composite tokens below:
      const expandedDictionary = { ...dictionary };
      // Expand composite tokens
      // Note: we need to overwrite both `allTokens` and `allProperties` as long as the latter deprecated alias exists
      // See: https://amzn.github.io/style-dictionary/#/version_3?id=style-properties-%e2%86%92-design-tokens
      expandedDictionary.allTokens = expandedDictionary.allProperties =
        dictionary.allTokens
          .map((token) => expandToken(token, nameTransformer))
          .flat();
    },
  },
  platforms: {
    test: {
      transformGroup: "scss",
      buildPath: "build/",
      files: [
        {
          // destination: 'test.json',
          // format: 'json/nested',
          destination: "map.scss",
          format: "scss/map-deep",
          mapName: "my-tokens",
        },
      ],
    },
  },
};
