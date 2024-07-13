import React, { useState } from 'react'
import SuperMaster from '../layouts/SuperMaster';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import { formatRichText } from '../utils/helperFile';
import rehypeRaw from 'rehype-raw';

function RichTextPage() {
    const navigate = useNavigate();
    const _siteContent = useSelector((state) => state._general.siteContent);
    const goBack = () => {
        navigate("/profile", { state: { from: 'my-personal-detail' } });
    }

    const getValue = (type = "content") => {
        const currentPath = window.location.pathname.replace('/', ''); // This will remove the leading slash and give you the path.
        const _obj = _siteContent.find(item => item.identifier === currentPath);
        return type === "title" ? _obj?.title : _obj?.content;
    }

    const markdownContent = formatRichText(getValue());


    return (
        <SuperMaster>
            <div id="aboutUs">
                <h3 style={{ marginBottom: 30 }}>{getValue("title")}</h3>
                <div id="markdown-container">
                    {/* <ReactMarkdown>{formatRichText(getValue())}</ReactMarkdown> */}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
                </div>
            </div>
        </SuperMaster>
    )
}
export default RichTextPage;