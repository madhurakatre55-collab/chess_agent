import asyncio
import os
import streamlit as st
from textwrap import dedent
from mcp_agent.app import MCPApp
from mcp_agents.agent import Agent
from mcp_agents.agent.workflows.llm.augment_llm_openai import OpenAIAugmentLLM
from mcp_agents.agent.workflows.llm.augment_llm_huggingface import HuggingFaceAugmentLLM 

st.set_page_config(page_title="MCP Agents", page_icon=":robot_face:", layout="wide")

st.markdown("<h1 style='text-align: center;'>MCP Agents</h1>", unsafe_allow_html=True)
st.markdown("Interact with a powerful web browsing agent that can navigate and interact with websites.")

with st.sidebar:
    st.markdown("## Examples Commands")
    
    st.markdown("**Navigation**")
    st.markdown("- `Go to [URL]`")
    
    st.markdown("**Interaction**")
    st.markdown("- `Click on [element]`")
    st.markdown("- Scroll down to view more content")
    
    st.markdown("**Multi-step Tasks**")
    st.markdown("-Navigate to [URL] and extract information from the page")
    st.markdown("Scroll down and summa")
    


