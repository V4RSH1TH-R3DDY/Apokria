"""Light wrapper for LLM providers: Google Gemini and OpenAI.

Usage:
  from utils.llm import generate_text
  text = generate_text(prompt, max_tokens=800)

Behaviour:
  - Respects env var LLM_PROVIDER: 'gemini' or 'openai'. If not set, tries to
    use Gemini if GEMINI_API_KEY/GOOGLE_GEMINI_API_KEY is present, otherwise OpenAI.
  - Returns generated text (string) or raises Exception on fatal errors.

Note: This wrapper is intentionally small — it doesn't implement streaming or
complex chat state. It provides a single synchronous generate_text call used
by agents in this repo.
"""
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Lazy imports
_genai = None
_openai = None


def _init_genai(api_key: str):
    global _genai
    if _genai is None:
        try:
            import google.generativeai as genai
            _genai = genai
        except Exception as e:
            logger.error(f"Failed to import google.generativeai: {e}")
            raise
    _genai.configure(api_key=api_key)
    return _genai


def _init_openai(api_key: str):
    global _openai
    if _openai is None:
        try:
            from openai import OpenAI
            _openai = OpenAI(api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to import openai: {e}")
            raise
    return _openai


def _choose_provider() -> str:
    provider = os.getenv("LLM_PROVIDER")
    if provider:
        return provider.lower()

    # Prefer Gemini if key present
    if os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    # Default to gemini (will error later if not configured)
    return "gemini"


def generate_text(prompt: str, *, max_tokens: int = 1024, temperature: float = 0.7, model: Optional[str] = None) -> str:
    """Generate text using the selected provider.

    Args:
        prompt: Prompt string
        max_tokens: token limit (provider-dependent)
        temperature: creativity parameter
        model: Optional model override (provider-specific)

    Returns:
        Generated text string
    """
    provider = _choose_provider()
    logger.debug(f"LLM provider chosen: {provider}")

    if provider == "gemini":
        api_key = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Gemini API key not configured (GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY)")

        genai = _init_genai(api_key)
        chosen_model = model or os.getenv("GEMINI_MODEL") or "gemini-pro"

        try:
            # Using the simple generate_content wrapper; adapt as needed
            gmodel = genai.GenerativeModel(chosen_model)
            resp = gmodel.generate_content(prompt)
            # depending on SDK, result may live in resp.text or resp.output[0].content
            if hasattr(resp, 'text') and resp.text:
                return resp.text
            if isinstance(resp, dict):
                # Best-effort parse
                return resp.get('output', [{}])[0].get('content', '')
            # Fallback
            return str(resp)
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            raise

    elif provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OpenAI API key not configured (OPENAI_API_KEY)")

        client = _init_openai(api_key)
        chosen_model = model or os.getenv("OPENAI_MODEL") or "gpt-3.5-turbo"

        try:
            # Use the modern client-based API (OpenAI >= 1.0.0)
            response = client.chat.completions.create(
                model=chosen_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            # Extract text from the response
            if response.choices:
                return response.choices[0].message.content.strip()
            return ""
        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}")
            raise

    else:
        raise RuntimeError(f"Unsupported LLM provider: {provider}")
