import os
import google.generativeai as genai
from ai.prompts import system_prompt_1, question_generation_prompt


genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

from io import BytesIO

def upload_to_gemini(image_data, mime_type=None, name=None, display_name=None):
    image_io = BytesIO(image_data)
    if mime_type is None:
        raise ValueError("mime_type must be provided when passing image data")
    
    file = genai.upload_file(image_io, mime_type=mime_type, name=name, display_name=display_name)
    print(f"Uploaded image as: {file.uri}")
    return file

def upload_url_to_gemini(path, mime_type=None):
  """Uploads the given file to Gemini.

  See https://ai.google.dev/gemini-api/docs/prompting_with_media
  """
  file = genai.upload_file(path, mime_type=mime_type)
  print(f"Uploaded file '{file.display_name}' as: {file.uri}")
  return file

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
generation_config_json = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}




FALLBACK_MODELS = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.0-pro"]

def chat_with_gemini(input_text, history):
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Trying chat with model: {model_name}")
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config,
                system_instruction=system_prompt_1,
            )
            chat_session = model.start_chat(history=history)
            response = chat_session.send_message(input_text)
            return response.text
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            continue
    raise Exception("All Gemini models failed for chat.")

def gen_ai_json(question, prompts):
    prompts_copy = prompts.copy() # Avoid modifying original list in retry loop
    prompts_copy.append(f"input: {question}")
    prompts_copy.append("output: ")
    
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Trying JSON gen with model: {model_name}")
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config_json,
            )
            response = model.generate_content(prompts_copy)
            return response.text
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            continue
    raise Exception("All Gemini models failed for JSON generation.")

def gen_ai_image(question, image, mime_type, prompts):
    files = [upload_to_gemini(image, mime_type)]
    print(files[0])
    
    prompts_copy = prompts.copy()
    prompts_copy.append(f"input: {question}")
    prompts_copy.append(files[0])
    prompts_copy.append("output: ")
    
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Trying Image gen with model: {model_name}")
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config,
            )
            response = model.generate_content(prompts_copy)
            return response.text
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            continue
    raise Exception("All Gemini models failed for Image generation.")

def gen_ai_image_json(question, image, mime_type, prompts):
    files = [upload_to_gemini(image, mime_type)]
    print(files[0])
    
    prompts_copy = prompts.copy()
    prompts_copy.append(f"input: {question}")
    prompts_copy.append(files[0])
    prompts_copy.append("output: ")
    
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Trying Image JSON gen with model: {model_name}")
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config_json,
            )
            response = model.generate_content(prompts_copy)
            return response.text
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            continue
    raise Exception("All Gemini models failed for Image JSON generation.")