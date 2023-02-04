// @ts-check
import filterConfigs from "../../utils/filterConfigs.js";
import {
  supportedConfigs,
  GlobalConfigOptions,
} from "../../utils/runtimeChecks.js";

const GlobalOnlyProperties = [
  "cacheDir",
  "assetFileNames",
  "globalImportRemoteImage",
];

const NonGlobalSupportedConfigs = supportedConfigs.filter(
  (key) => !GlobalOnlyProperties.includes(key)
);

const NonProperties = {
  Img: [
    "tag",
    "content",
    "backgroundSize",
    "backgroundPosition",
    "fallbackFormat",
    "includeSourceFormat",
    "fadeInTransition",
    "artDirectives",
  ],
  Picture: ["tag", "content", "backgroundSize", "backgroundPosition"],
  BackgroundImage: [
    "alt",
    "loading",
    "decoding",
    "layout",
    "objectFit",
    "objectPosition",
    "fadeInTransition",
  ],
  BackgroundPicture: ["alt", "backgroundSize", "backgroundPosition"],
};

const ImgProperties = NonGlobalSupportedConfigs.filter(
    (key) => !NonProperties.Img.includes(key)
  ),
  PictureProperties = NonGlobalSupportedConfigs.filter(
    (key) => !NonProperties.Picture.includes(key)
  ),
  BackgroundImageProperties = NonGlobalSupportedConfigs.filter(
    (key) => !NonProperties.BackgroundImage.includes(key)
  ),
  BackgroundPictureProperties = NonGlobalSupportedConfigs.filter(
    (key) => !NonProperties.BackgroundPicture.includes(key)
  );

const SupportedProperties = {
  Img: ImgProperties,
  Picture: PictureProperties,
  BackgroundImage: BackgroundImageProperties,
  BackgroundPicture: BackgroundPictureProperties,
};

export default function getFilteredProps(type, props) {
  const filteredGlobalConfigs = filterConfigs(
    "Global",
    GlobalConfigOptions,
    SupportedProperties[type],
    { warn: false }
  );

  const { search, searchParams } = new URL(props.src, "file://");

  props.src = props.src.replace(search, "");

  const paramOptions = Object.fromEntries(searchParams);

  const filteredLocalProps = filterConfigs(
    type,
    {
      ...paramOptions,
      ...props,
    },
    SupportedProperties[type]
  );

  const resolvedProps = {
    ...filteredGlobalConfigs,
    ...filteredLocalProps,
  };

  const {
    src,
    alt,
    tag = "section",
    content = "",
    sizes = function (breakpoints) {
      const maxWidth = breakpoints[breakpoints.length - 1];
      return `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`;
    },
    preload,
    loading = preload ? "eager" : "lazy",
    decoding = "async",
    attributes = {},
    layout = "constrained",
    placeholder = "blurred",
    breakpoints,
    objectFit = "cover",
    objectPosition = "50% 50%",
    backgroundSize = "cover",
    backgroundPosition = "50% 50%",
    format = type === "Img" ? undefined : ["avif", "webp"],
    fallbackFormat,
    includeSourceFormat = true,
    formatOptions = {
      tracedSVG: {
        function: "trace",
      },
    },
    fadeInTransition = true,
    artDirectives,
    ...transformConfigs
  } = resolvedProps;

  // prettier-ignore
  const allProps = {
    src, alt, tag, content, sizes, preload, loading, decoding, attributes, layout, placeholder,
    breakpoints, objectFit, objectPosition, backgroundSize, backgroundPosition, format,
    fallbackFormat, includeSourceFormat, formatOptions, fadeInTransition, artDirectives,
    ...transformConfigs,
  };

  const filteredProps = filterConfigs(
    type,
    allProps,
    SupportedProperties[type],
    { warn: false }
  );

  return {
    filteredProps,
    transformConfigs,
  };
}
