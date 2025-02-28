---
title: Building Python Audio Consumers for Amazon Connect Kinesis Media Streams
description: Learn how to stream, process, and save live audio from Amazon Connect using Kinesis Video Streams and Python
head:
  - - meta
    - property: 'og:description'
      content: Learn how to stream, process, and save live audio from Amazon Connect using Kinesis Video Streams and Python
  - - meta
    - property: 'og:title'
      content: Building Python Audio Consumers for Amazon Connect Kinesis Media Streams | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://lh3.googleusercontent.com/d/1WRWdjaxVMvVRaYK-hEcqUXwTHzXGZVHn
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog/python-kvs-audio-consumer
  - - meta
    - property: keywords
      content: 'AWS, Amazon Connect, Python, Kinesis Video Stream, Audio Consumer, KVS Consumer, Neudeck'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: Building Python Audio Consumers for Amazon Connect Kinesis Media Streams | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: Learn how to stream, process, and save live audio from Amazon Connect using Kinesis Video Streams and Python
  - - meta
    - name: 'twitter:image'
      content: https://lh3.googleusercontent.com/d/1WRWdjaxVMvVRaYK-hEcqUXwTHzXGZVHn
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com/blog/python-kvs-audio-consumer
  - - meta
    - name: google-site-verification
      content: 9agtSktJYcUTkHEIMiXa-0GX5OAFp-aq-M-sGdHEDm8
---
<script setup>
import Hero from '../../components/Hero.vue'
import Share from '../../components/Share.vue'
const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const empty_string = ""
const title = "Building Python Audio Consumers for Amazon Connect Kinesis Media Streams"
const shortDescription = "Learn how to stream, process, and save live audio from Amazon Connect using Kinesis Video Streams and Python"
const subtitle = "2024-11-11"
const tags = [
      "AWS",
      "Amazon Connect",
      "Python",
      "Kinesis Video Stream",
      "Audio Consumer",
      "KVS Consumer"
    ]
</script>
# Building Python Audio Consumers for Amazon Connect Kinesis Media Streams
<Hero :title="empty_string" :subtitle="prettyDate(subtitle)"/>
<Share :title="title" :shortDescription="shortDescription" :tags="tags"/>

## Streaming Audio from Amazon Connect

Amazon Connect simplifies connecting agents with customers through its telephony platform. A key feature is the ability to record calls and store them in an S3 bucket for review and further processing. However, if you need real-time insights, streaming live call audio from Amazon Connect, transcribing it and processing the text can provide immediate feedback such as sentiment analysis, automatic ticket creation, and post-call summaries.

Amazon Connect supports streaming audio data from both agents and customers to Kinesis Video Streams. By using the Start Streaming Connect Flow Block in conjunction with an invoke Lambda block, you can create a consumer for this media stream and process audio data in real time. For detailed setup instructions, refer to [this tutorial](https://docs.aws.amazon.com/connect/latest/adminguide/customer-voice-streams.html).

When properly configured, a Lambda function will be triggered for each call in Amazon Connect. This Lambda function receives an event containing details about the Kinesis Video Stream, as shown in the example below. We will need these variables for further processing:

```json
"Event": {
	...
	"MediaStreams": {
     "Customer": {
       "Audio": {
         "StreamARN": "arn:aws:kinesisvideo::eu-west-2:111111111111:stream/instance-alias-contact-ddddddd-bbbb-dddd-eeee-ffffffffffff/9999999999999",
         "StartTimestamp": "1571360125131",
         "StopTimestamp": "1571360126131",
         "StartFragmentNumber": "100"
       }
     }
   }
}
```

Note: While the service is named Kinesis Video Streams (KVS), it is capable of handling various types of media, including audio. Do not be confused; we are dealing with audio data, not images.

## Consuming the Stream

Reading audio data from KVS can be complex. Amazon provides a [Java-based solution on GitHub](https://github.com/amazon-connect/amazon-connect-realtime-transcription). However, this tutorial will demonstrate a simpler approach using Python 3.12. This Python solution enables data science teams with no Java experience to engage directly with the data pipeline.

The Python implementation converts raw incoming audio bytes into `WAV` format every second. These files can be saved locally, sent to an API for further processing, or transcribed using OpenAI's Whisper or AWS Transcribe. Transcribed audio can then be used for real-time call analysis, potentially providing agents with insights into relevant technical documentation or relevant customer data.

## Architecture

Below is a simplified architecture diagram:

![Architecture](https://lh3.googleusercontent.com/d/1E5mf8kf3BM7dIBfcr-elzQz_aGYyNZXS)

## Understanding the Data Structure

To consume data from Kinesis Video Streams, you start by invoking the `GetMedia` endpoint on the Kinesis Video Media Service. This operation provides a Kinesis Client, which allows you to call the `get_media` function and receive a streaming buffer. You can then use the `StreamingBody` object iterator to process chunks from this buffer until the stream ends, which typically happens when the call on Amazon Connect is terminated.

For more details on the `GET_MEDIA` endpoint, refer to the [AWS Documentation](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-data.html).

Here is a Python example demonstrating how to set up and use this endpoint:

```python
import boto3

AWS_REGION = your_aws_region
KVS_STREAM_NAME = your_kvs_stream_name
FRAGMENT_NUMBER = the_fragment_you_want_to_start

session = boto3.Session(region_name=AWS_REGION)
kvs_client = session.client("kinesisvideo")

response = kvs_client.get_data_endpoint(
  StreamName=KVS_STREAM_NAME,
  APIName="GET_MEDIA"
)
get_media_endpoint = response['DataEndpoint']

kvs_media_client = session.client('kinesis-video-media', endpoint_url=get_media_endpoint)

get_media_response = kvs_media_client.get_media(
    StreamName=KVS_STREAM_NAME,
    StartSelector={
        "StartSelectorType": "FRAGMENT_NUMBER",
        "AfterFragmentNumber": FRAGMENT_NUMBER,
    },
)

kvs_streaming_buffer = get_media_response["Payload"]

for chunk in kvs_streaming_buffer:
	pass
```

The data chunks are in Matroska (MKV) format. For a detailed explanation of the returned data, consult [this resource](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-data.html).

AWS provides a [GitHub repository](https://github.com/aws-samples/amazon-kinesis-video-streams-consumer-library-for-python) with a Python consumer library for Kinesis Video Streams that handles video footage. This library utilizes `ebmlite` to parse MKV data. You can read more about `ebmlite` [here](https://github.com/MideTechnology/ebmlite). The `ebmlite` library parses raw streaming data into an `EBMLite Document`, which is a DOM-like structure of the elements and tags within a fragment. From this structure, audio bytes can be extracted.

Here is a brief overview of the repository’s operation:

1. The `KvsConsumerLibrary` starts as a thread, initialized with details about the Kinesis stream, such as the `get_media_response` mentioned earlier.
2. This thread continuously reads the latest data, structures it using the `ebmlite` library, and invokes callback functions when a complete fragment is received or the stream ends.
3. Actions performed on the incoming data are defined in these callback functions. For instance, in the AWS video processiong repository, the `on_fragment_arrived` function processes each fragment by extracting 3-4 frames from the video stream and saving them as JPEG images locally.

For this project, I forked the video processing repository and modified it to handle audio instead of video. My refactored GitHub repository is available [here](https://github.com/heushreck/amazon-kvs-audio-consumer-library-for-python).

Below, I outline the steps required to adapt the consumer from video to audio processing.

## Extract Audio Bytes from MKV Data Stream

When a full fragment of data is received, it is mapped to the `EBMLite Document` and the structure is printed within the `on_fragment_arrived` function in the `kvs_consumer_library_example.py` file. The structure typically looks like this:

```text
MatroskaDocument (Document, type matroska)
    EBML (ID 0x1A45DFA3): (master) 7 subelements
        EBMLVersion (ID 0x4286): (int) 1
        EBMLReadVersion (ID 0x42F7): (int) 1
        EBMLMaxIDLength (ID 0x42F2): (int) 4
        EBMLMaxSizeLength (ID 0x42F3): (int) 8
        DocType (ID 0x4282): (str) 'matroska'
        DocTypeVersion (ID 0x4287): (int) 2
        DocTypeReadVersion (ID 0x4285): (int) 2
    Segment (ID 0x18538067): (master) 11 subelements
        Info (ID 0x1549A966): (master) 5 subelements
            SegmentUID (ID 0x73A4): (bytearray)
            TimecodeScale (ID 0x2AD7B1): (int) 1000000
            Title (ID 0x7BA9): (str) 'Kinesis Video SDK'
            MuxingApp (ID 0x4D80): (str) 'Kinesis Video SDK 1.1.0 JNI 2.0'
            WritingApp (ID 0x5741): (str) 'Kinesis Video SDK 1.1.0 JNI 2.0'
        Tracks (ID 0x1654AE6B): (master) 2 subelements
            TrackEntry (ID 0xAE): (master) 6 subelements
                TrackNumber (ID 0xD7): (int) 1
                TrackUID (ID 0x73C5): (int) 1
                TrackType (ID 0x83): (int) 2
                Name (ID 0x536E): (str) 'AUDIO_FROM_CUSTOMER'
                CodecID (ID 0x86): (str) 'A_AAC'
                CodecPrivate (ID 0x63A2): (bytearray)
            TrackEntry (ID 0xAE): (master) 6 subelements
                TrackNumber (ID 0xD7): (int) 2
                TrackUID (ID 0x73C5): (int) 2
                TrackType (ID 0x83): (int) 2
                Name (ID 0x536E): (str) 'AUDIO_TO_CUSTOMER'
                CodecID (ID 0x86): (str) 'A_AAC'
                CodecPrivate (ID 0x63A2): (bytearray)
        Tags (ID 0x1254C367): (master) 1 subelements
            Tag (ID 0x7373): (master) 3 subelements
                SimpleTag (ID 0x67C8): (master) 2 subelements
                    TagName (ID 0x45A3): (str) 'AWS_KINESISVIDEO_FRAGMENT_NUMBER'
                    TagString (ID 0x4487): (str) '91343852333181531502161607852955530730504675150'
                SimpleTag (ID 0x67C8): (master) 2 subelements
                    TagName (ID 0x45A3): (str) 'AWS_KINESISVIDEO_SERVER_TIMESTAMP'
                    TagString (ID 0x4487): (str) '1726677687.758'
                SimpleTag (ID 0x67C8): (master) 2 subelements
                    TagName (ID 0x45A3): (str) 'AWS_KINESISVIDEO_PRODUCER_TIMESTAMP'
                    TagString (ID 0x4487): (str) '1726677688.724'
    Cluster (ID 0x1F43B675): (master) 34 subelements
        Timecode (ID 0xE7): (int) 1726677688724
        Position (ID 0xA7): (int) 0
        SimpleBlock (ID 0xA3): (bytearray) repeated 34 times
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'ContactId'
                TagString (ID 0x4487): (str) 'd111f871-5fe7-40b1-b5f7-6b67060de0c2'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'InstanceId'
                TagString (ID 0x4487): (str) 'd5b716a2-10bb-45cb-bf7f-01a9864be591'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'MimeType'
                TagString (ID 0x4487): (str) 'audio/L16;rate=8000;channels=1;'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'AUDIO_FROM_CUSTOMER'
                TagString (ID 0x4487): (str) '1'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'AUDIO_TO_CUSTOMER'
                TagString (ID 0x4487): (str) '2'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 1 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'Events'
                TagString (ID 0x4487): (str) '[]'
    Tags (ID 0x1254C367): (master) 1 subelements
        Tag (ID 0x7373): (master) 2 subelements
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'AWS_KINESISVIDEO_MILLIS_BEHIND_NOW'
                TagString (ID 0x4487): (str) '78569'
            SimpleTag (ID 0x67C8): (master) 2 subelements
                TagName (ID 0x45A3): (str) 'AWS_KINESISVIDEO_CONTINUATION_TOKEN'
                TagString (ID 0x4487): (str) 'FRAGMENT_NUMBER'
```
This data represents approximately 1 second of audio from both the agent and the customer. The fragment contains various header fields that provide information such as the fragment number, the delay from the live call (in milliseconds), and other relevant details. For further information, refer to the[AWS Documentation](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-data.html).

A crucial piece of information in the fragment header is identifying who is speaking and which track they are using. The following function helps determine if audio track 0 belongs to the agent or the customer, and similarly for audio track 1:

```python
def get_audio_tracks(self, fragment_dom):
    audio_from_customer_track, audio_to_customer_track = 0, 0
    # Get the Segment Element of the Fragment DOM - error if not found
    segment_element = None
    for element in fragment_dom:
        if element.id == 0x18538067:  # MKV Segment Element ID
            segment_element = element
            break
    if not segment_element:
        raise KeyError("Segment Element required but not found in fragment_doc")

    for element in segment_element:
        if element.id == 0x1654AE6B:  # Tracks
            for el in element:
                if el.id == 0xAE:
                    track_number = -1
                    track_name = ""
                    for e in el:
                        if e.id == 0x536E:  # TrackName
                            track_name = e.value
                        elif e.id == 0xD7:  # TrackNumber
                            track_number = e.value
                    if track_name == "AUDIO_FROM_CUSTOMER":
                        audio_from_customer_track = track_number
                    elif track_name == "AUDIO_TO_CUSTOMER":
                        audio_to_customer_track = track_number
    if audio_from_customer_track == 0 or audio_to_customer_track == 0:
        log.error("Audio tracks not found in the fragment")
        audio_from_customer_track = 1
        audio_to_customer_track = 2
    return int(audio_from_customer_track), int(audio_to_customer_track)
```

In addition to mapping audio tracks, our primary focus is on extracting the actual audio bytes. According to AWS documentation, these are contained within the `SimpleBlock` elements. I have implemented a function in the `KvsFragmentProcessor` class that identifies all `SimpleBlock` elements within the entire DOM and returns the start offset and size of each block:

```python
def get_simple_block_offset(self, fragment_dom):
    # Locate the Segment Element in the Fragment DOM - raise an error if not found
    segment_element = None
    for element in fragment_dom:
        if element.id == 0x18538067:  # MKV Segment Element ID
            segment_element = element
            break
    if not segment_element:
        raise KeyError("Segment Element required but not found in fragment_dom")

    simple_block_elements = []
    for element in segment_element:
        if element.id == 0x1F43B675:  # MKV SimpleBlock Element ID
            for el in element:
                if el.id == 0xA3:  # SimpleBlock ID
                    simple_block_elements.append((el.payloadOffset, el.size))
            break
    return simple_block_elements
```

Each `SimpleBlock` element contains a header with information about its contents. To extract the data and determine the track number, the following function can be used:

```python
def extract_simpleblock_data(self, byte_array):
    """
    Extracts the track number and the data payload from a Matroska SimpleBlock bytearray.
    """
    # Parse track number
    track_number, size = self.parse_vint(byte_array, 0)

    # Skip the track number and timestamp (2 bytes) to get to the payload
    payload_offset = (
        size + 2 + 1
    )  # 2 bytes for the timestamp and 1 byte for the flags

    # Read the rest of the data as the payload
    data_payload = byte_array[payload_offset:]

    return track_number, data_payload
```

These functions allow us to accurately locate and extract audio data from a `SimpleBlock` element.
With the information we've gathered, we can construct a function that consolidates raw audio data from each `SimpleBlock` element into a single `bytearray`.

```python
class KvsPythonConsumerExample:
	def __init__(self):
		...
		self.kvs_fragment_processor = KvsFragementProcessor()
		self.audio_to_customer = bytearray()
        self.audio_from_customer = bytearray()
        self.current_audio_length = 0.0
        ...
    
	def on_fragment_arrived(self,fragment_bytes, fragment_dom,...):
		...
        # Retrieve SimpleBlock elements from the fragment DOM
		simple_block_elements = self.kvs_fragment_processor.get_simple_block_offset(
		    fragment_dom
		)
        # Get audio track numbers
		audio_from_customer_track, audio_to_customer_track = (
		    self.kvs_fragment_processor.get_audio_tracks(fragment_dom)
		)
		for offset, size in simple_block_elements:
            # Extract track number and data payload from each SimpleBlock
		    track_number, data_payload = (
		        self.kvs_fragment_processor.extract_simpleblock_data(
		            fragment_bytes[offset : (offset + size)]
		        )
		    )
            # Append audio data to the appropriate bytearray based on track number
		    if track_number == audio_from_customer_track:
		        self.audio_from_customer.extend(data_payload)
		    elif track_number == audio_to_customer_track:
		        self.audio_to_customer.extend(data_payload)
            # Calculate the length of the audio data in seconds
		    length = float(size) / 2.0 / 8000.0
		    self.current_audio_length += length
		    log.debug(f"Audio Length: {self.current_audio_length}")
```

### Explanation

- **Initialization**: In the `__init__` method, the `KvsFragmentProcessor` instance is created, and `bytearray` objects for customer audio and agent audio are initialized. The `current_audio_length` is set to zero.

- **Fragment Processing**: When a fragment arrives, the `on_fragment_arrived` method processes the fragment:
  - It retrieves `SimpleBlock` elements and audio track numbers.
  - For each `SimpleBlock`, it extracts the track number and data payload.
  - It appends the audio data to the appropriate `bytearray` based on the track number.
  - It calculates the length of the audio data and updates the total audio length.

This approach ensures that all raw audio data is accumulated and processed correctly during the call.

### Saving the Audio

The `KvsConsumerLibrary`, which triggers the `on_fragment_arrived` function, also invokes the `on_stream_read_complete` function when the call ends. In our case, this function saves the audio bytes to local storage.

```python
from pydub import AudioSegment

def on_stream_read_complete(self, stream_name):
	self.save_audio_files(self.audio_to_customer, self.audio_from_customer)
def save_audio_files(self, audio_to_customer, audio_from_customer):
  min_length = min(len(audio_to_customer), len(audio_from_customer))
  channels = 1
  sample_width = 2
  sample_rate = 8000
  # Convert raw audio bytes to AudioSegment objects
  audio_to_customer_audio_stream = BytesIO(bytes(audio_to_customer[:min_length]))
  audio_to_customer_audio_segment = AudioSegment.from_file(
      audio_to_customer_audio_stream,
      format="raw",
      codec="pcm_s16le",
      frame_rate=sample_rate,
      channels=channels,
      sample_width=sample_width,
  )

  audio_from_customer_audio_stream = BytesIO(
      bytes(audio_from_customer[:min_length])
  )
  audio_from_customer_audio_segment = AudioSegment.from_file(
      audio_from_customer_audio_stream,
      format="raw",
      codec="pcm_s16le",
      frame_rate=sample_rate,
      channels=channels,
      sample_width=sample_width,
  )

  # Ensure both audio segments are of the same length by adding silence to the shorter one
  max_length = max(
      len(audio_to_customer_audio_segment), len(audio_from_customer_audio_segment)
  )
  audio_to_customer_audio_segment = (
      audio_to_customer_audio_segment
      + AudioSegment.silent(
          duration=max_length - len(audio_to_customer_audio_segment),
          frame_rate=sample_rate,
      )
  )
  audio_from_customer_audio_segment = (
      audio_from_customer_audio_segment
      + AudioSegment.silent(
          duration=max_length - len(audio_from_customer_audio_segment),
          frame_rate=sample_rate,
      )
  )

  # MONO (agent and customer audio combined)
  # combined_audio1_file_name = "combined_mono_audio.wav"
  # combined_audio1 = audio_to_customer_audio_segment.overlay(
  #     audio_from_customer_audio_segment
  # )
  # combined_audio1.export(combined_audio1_file_name, format='wav')

  # STEREO (agent on left channel, customer on right channel - good for transcription)
  combined_audio_file_name = "combined_stereo_audio.wav"
  try:
      combined_audio = AudioSegment.from_mono_audiosegments(
          audio_from_customer_audio_segment, audio_to_customer_audio_segment
      )
      combined_audio.export(combined_audio_file_name, format='wav')
  except Exception as e:
      log.error(f"Error combining audio: {e}")
```

### Explanation

- **Initialization**: The `on_stream_read_complete` function calls `save_audio_files` with the audio data from the customer and agent.

- **Audio Processing**:
  - **Conversion**: Raw audio bytes are converted into `AudioSegment` objects using the `BytesIO` stream.
  - **Length Adjustment**: If the audio segments are not of equal length, silence is added to the shorter segment.
  - **Combination**: The audio segments are combined into a stereo file, where one channel contains the customer's audio and the other contains the agent's audio.

**Stereo vs. Mono**: Saving audio in stereo can be advantageous for transcription purposes, as it allows transcribers to separate and process the audio from the agent and the customer more effectively.

## Resources

### Code Repositories

- **Code from this Tutorial**: [amazon-kvs-audio-consumer-library-for-python](https://github.com/heushreck/amazon-kvs-audio-consumer-library-for-python)
- **Original Python Video Consumer Repository**: [amazon-kinesis-video-streams-consumer-library-for-python](https://github.com/aws-samples/amazon-kinesis-video-streams-consumer-library-for-python)
- **Java Implementation of Audio Consumer**: [amazon-connect-realtime-transcription](https://github.com/amazon-connect/amazon-connect-realtime-transcription)

### Documentation

- **Amazon Connect Set up Audio Streaming**: [Customer Voice Streams](https://docs.aws.amazon.com/connect/latest/adminguide/customer-voice-streams.html)
- **Kinesis Video Stream Data Structure**: [How Data is Structured](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-data.html)
- **Matroska Data Structure**: [Matroska Elements](https://www.matroska.org/technical/elements.html)
