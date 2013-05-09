
#
# Create JSOG.encode() and JSOG.decode()
#

JSOG = {}

nextId = 1

# Strip out any @id fields
stripIds = (obj) ->
	#console.log "stripping #{JSON.stringify(obj)}"

	if Array.isArray(obj)
		for val in obj
			stripIds(val)
	else if typeof obj == 'object'
		delete obj['@id']
		for key, val of obj
			stripIds(val)

#
# Take a JSON structure with cycles and turn it into a JSOG-encoded structure. Adds
# @id to every object and replaces duplicate references with @refs.
#
# Note that this modifies the original objects adding @id fields, then strips
# out those @id fields leaving the original objects as they started.
#
JSOG.encode = (original) ->
	#console.log "encoding #{JSON.stringify(original)}"

	doEncode = (original) ->
		encodeObject = (original) ->
			if original['@id']?
				return { '@ref': original['@id'] }

			result = {}
			original['@id'] = "#{nextId++}"
			for key, value of original
				result[key] = doEncode(value)

			return result

		encodeArray = (original) ->
			return (encode val for val in original)

		if Array.isArray(original)
			return encodeArray(original)
		else if typeof original == 'object'
			return encodeObject(original)
		else
			return original

	result = doEncode(original)
	stripIds(original)
	return result

#
# Take a JSOG-encoded JSON structure and re-link all the references. The return value will
# not have any @id or @ref fields
#
JSOG.decode = (encoded) ->
	# Holds every @id found so far - this is why id values must be strings
	found = {}

	doDecode = (encoded) ->
		console.log "decoding #{JSON.stringify(encoded)}"

		decodeObject = (encoded) ->
			if encoded['@ref']?
				return found[encoded['@ref']]

			result = {}
			found[encoded['@id']] = result

			for key, value of encoded
				if key != '@id'
					result[key] = doDecode(value)

			return result

		decodeArray = (encoded) ->
			result = []
			for value in encoded
				result.push(decode(value))

			return result

		if Array.isArray(encoded)
			return decodeArray(encoded)
		else if typeof encoded == 'object'
			return decodeObject(encoded)
		else
			return encoded

	return doDecode(encoded)

#
# Export to anywhere appropriate
#

if module && module.exports
	module.exports = JSOG

if window?
	window.JSOG = JSOG
