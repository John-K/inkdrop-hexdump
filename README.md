# Markdown Hexdump Inkdrop Plugin 
![](https://inkdrop-plugin-badge.vercel.app/api/version/hexdump) ![](https://inkdrop-plugin-badge.vercel.app/api/downloads/hexdump)

A plugin for [Inkdrop](https://www.inkdrop.info/) which adds a hexdump formatting component to markdown.

## Usage
Hexdump is used by wrapping hex characters in a code block marked with 'hexdump'. Whitespace and newlines are ignored.

## Example

    ```hexdump
    ABADD00D4865 6c6c 6f20 576f 726c 640a0011223344556677889
    9aabbccddeeff
    ```

The above is transformed into a markdown block as below
```
000000: AB AD D0 0D 48 65 6c 6c 6f 20 57 6f 72 6c 64 0a | ....Hello World. |
000010: 00 11 22 33 44 55 66 77 88 99 aa bb cc dd ee ff | .."3DUfw........ |
```
## Install

```sh
ipm install hexdump
```
