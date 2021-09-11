import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled/macro";
import { css } from "@emotion/css/macro";
import { useTranslation } from "react-i18next";
import { LoadingOutlined, MinusOutlined } from "@ant-design/icons";
import { useInViewport } from "ahooks";
import isInViewPort from "@/lib/util/isInViewPort";

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  > * {
    padding: 0 5px;
  }
`;

const Retry = styled.span`
  cursor: pointer;
`;

const tipColor = css`
  color: #84868c;
`;

type LoadRenderer = (
  nodes: {
    loadMore: ReactNode;
    noMore: ReactNode;
    loadError: ReactNode;
  },
  hasMore: boolean,
  hasError: boolean
) => ReactNode;

const defaultLoadRenderer: LoadRenderer = (nodes, hasMore, hasError) => {
  const { loadMore, noMore, loadError } = nodes;

  if (hasError) {
    return loadError;
  }

  if (hasMore) {
    return loadMore;
  }

  return noMore;
};

export interface LoadMoreProps {
  children: ReactNode | ((loadEle: ReactNode) => ReactNode);
  hasMore: boolean;
  onLoadMore: () => Promise<any>;
  loadRenderer?: LoadRenderer;
  loadingDelay?: number;
}

function LoadMore(props: LoadMoreProps) {
  const {
    children,
    hasMore,
    onLoadMore,
    loadRenderer = defaultLoadRenderer,
    loadingDelay = 1000,
  } = props;

  const { t } = useTranslation();

  const label = t("loadMore", { returnObjects: true });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreVisible = useInViewport(loadMoreRef);

  const [loading, setLoading] = useState(false);

  const [hasError, setHasError] = useState(false);

  const loadEle = useMemo(() => {
    const loadMore = (
      <Footer>
        <LoadingOutlined />
        <span className={tipColor}>{label.loading}</span>
      </Footer>
    );

    const noMore = (
      <Footer>
        <MinusOutlined className={tipColor} />
        <span className={tipColor}>{label.noMore}</span>
        <MinusOutlined className={tipColor} />
      </Footer>
    );

    const loadError = (
      <Footer onClick={() => setHasError(false)}>
        <MinusOutlined className={tipColor} />
        <Retry className={tipColor}>{label.error}</Retry>
        <MinusOutlined className={tipColor} />
      </Footer>
    );

    const ele = loadRenderer(
      {
        loadMore,
        noMore,
        loadError,
      },
      hasMore,
      hasError
    );

    return <div ref={loadMoreRef}>{ele}</div>;
  }, [hasError, hasMore, loadRenderer, label]);

  const refs = useRef({
    onLoadMore,
  });
  refs.current = {
    onLoadMore,
  };

  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = true;
    let needLoad = true;

    if (
      !hasMore ||
      hasError ||
      loading ||
      !loadMoreVisible ||
      !isInViewPort(loadMoreRef.current)
    ) {
      needLoad = false;
    }

    if (needLoad) {
      const {
        current: { onLoadMore },
      } = refs;

      setLoading(true);
      onLoadMore()
        .catch(() => {
          isMountRef.current && setHasError(true);
        })
        .finally(() => {
          setTimeout(
            () => isMountRef.current && setLoading(false),
            loadingDelay
          );
        });
    }
    return () => {
      isMountRef.current = false;
    };
  }, [loadMoreVisible, loading, hasMore, hasError, loadingDelay]);

  if (typeof children === "function") {
    return children(loadEle);
  }

  return (
    <>
      {children}
      {loadEle}
    </>
  );
}

export default LoadMore;
