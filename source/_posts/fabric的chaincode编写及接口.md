---
title: fabric的chaincode编写及接口
tags: 区块链
categories: 区块链
toc: true
abbrlink: 53606
date: 2018-04-21 17:57:38
---

- fabric里链码的编写是go语言，一般编写和调试可在开发环境进行快速测试和开发。上次笔记有介绍。
- chaincode的编写比较简单,主要涉及2个接口，实现这2个接口，在接口里编写对应的业务即可。


```
func (s *gomevisionchaincode) Init(apiSub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (s *gomevisionchaincode) Invoke(apiSub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}
```

#### chaincode涉及的接口操作
- 对fabric的操作都包含在这些接口里,链码通过这些接口与区块链fabric进行通信，上边的2个接口里调用以下方法进行与fabric交互。

```
type ChaincodeStubInterface interface {
	// GetArgs returns the arguments intended for the chaincode Init and Invoke
	// as an array of byte arrays.
	GetArgs() [][]byte

	// GetStringArgs returns the arguments intended for the chaincode Init and
	// Invoke as a string array. Only use GetStringArgs if the client passes
	// arguments intended to be used as strings.
	GetStringArgs() []string

	// GetFunctionAndParameters returns the first argument as the function
	// name and the rest of the arguments as parameters in a string array.
	// Only use GetFunctionAndParameters if the client passes arguments intended
	// to be used as strings.
	GetFunctionAndParameters() (string, []string)

	// GetArgsSlice returns the arguments intended for the chaincode Init and
	// Invoke as a byte array
	GetArgsSlice() ([]byte, error)

	// GetTxID returns the tx_id of the transaction proposal (see ChannelHeader
	// in protos/common/common.proto)
	GetTxID() string

	// InvokeChaincode locally calls the specified chaincode `Invoke` using the
	// same transaction context; that is, chaincode calling chaincode doesn't
	// create a new transaction message.
	// If the called chaincode is on the same channel, it simply adds the called
	// chaincode read set and write set to the calling transaction.
	// If the called chaincode is on a different channel,
	// only the Response is returned to the calling chaincode; any PutState calls
	// from the called chaincode will not have any effect on the ledger; that is,
	// the called chaincode on a different channel will not have its read set
	// and write set applied to the transaction. Only the calling chaincode's
	// read set and write set will be applied to the transaction. Effectively
	// the called chaincode on a different channel is a `Query`, which does not
	// participate in state validation checks in subsequent commit phase.
	// If `channel` is empty, the caller's channel is assumed.
	InvokeChaincode(chaincodeName string, args [][]byte, channel string) pb.Response

	// GetState returns the value of the specified `key` from the
	// ledger. Note that GetState doesn't read data from the writeset, which
	// has not been committed to the ledger. In other words, GetState doesn't
	// consider data modified by PutState that has not been committed.
	// If the key does not exist in the state database, (nil, nil) is returned.
	GetState(key string) ([]byte, error)

	// PutState puts the specified `key` and `value` into the transaction's
	// writeset as a data-write proposal. PutState doesn't effect the ledger
	// until the transaction is validated and successfully committed.
	// Simple keys must not be an empty string and must not start with null
	// character (0x00), in order to avoid range query collisions with
	// composite keys, which internally get prefixed with 0x00 as composite
	// key namespace.
	PutState(key string, value []byte) error

	// DelState records the specified `key` to be deleted in the writeset of
	// the transaction proposal. The `key` and its value will be deleted from
	// the ledger when the transaction is validated and successfully committed.
	DelState(key string) error

	// GetStateByRange returns a range iterator over a set of keys in the
	// ledger. The iterator can be used to iterate over all keys
	// between the startKey (inclusive) and endKey (exclusive).
	// The keys are returned by the iterator in lexical order. Note
	// that startKey and endKey can be empty string, which implies unbounded range
	// query on start or end.
	// Call Close() on the returned StateQueryIteratorInterface object when done.
	// The query is re-executed during validation phase to ensure result set
	// has not changed since transaction endorsement (phantom reads detected).
	GetStateByRange(startKey, endKey string) (StateQueryIteratorInterface, error)

	// GetStateByPartialCompositeKey queries the state in the ledger based on
	// a given partial composite key. This function returns an iterator
	// which can be used to iterate over all composite keys whose prefix matches
	// the given partial composite key. The `objectType` and attributes are
	// expected to have only valid utf8 strings and should not contain
	// U+0000 (nil byte) and U+10FFFF (biggest and unallocated code point).
	// See related functions SplitCompositeKey and CreateCompositeKey.
	// Call Close() on the returned StateQueryIteratorInterface object when done.
	// The query is re-executed during validation phase to ensure result set
	// has not changed since transaction endorsement (phantom reads detected).
	GetStateByPartialCompositeKey(objectType string, keys []string) (StateQueryIteratorInterface, error)

	// CreateCompositeKey combines the given `attributes` to form a composite
	// key. The objectType and attributes are expected to have only valid utf8
	// strings and should not contain U+0000 (nil byte) and U+10FFFF
	// (biggest and unallocated code point).
	// The resulting composite key can be used as the key in PutState().
	CreateCompositeKey(objectType string, attributes []string) (string, error)

	// SplitCompositeKey splits the specified key into attributes on which the
	// composite key was formed. Composite keys found during range queries
	// or partial composite key queries can therefore be split into their
	// composite parts.
	SplitCompositeKey(compositeKey string) (string, []string, error)

	// GetQueryResult performs a "rich" query against a state database. It is
	// only supported for state databases that support rich query,
	// e.g.CouchDB. The query string is in the native syntax
	// of the underlying state database. An iterator is returned
	// which can be used to iterate (next) over the query result set.
	// The query is NOT re-executed during validation phase, phantom reads are
	// not detected. That is, other committed transactions may have added,
	// updated, or removed keys that impact the result set, and this would not
	// be detected at validation/commit time.  Applications susceptible to this
	// should therefore not use GetQueryResult as part of transactions that update
	// ledger, and should limit use to read-only chaincode operations.
	GetQueryResult(query string) (StateQueryIteratorInterface, error)

	// GetHistoryForKey returns a history of key values across time.
	// For each historic key update, the historic value and associated
	// transaction id and timestamp are returned. The timestamp is the
	// timestamp provided by the client in the proposal header.
	// GetHistoryForKey requires peer configuration
	// core.ledger.history.enableHistoryDatabase to be true.
	// The query is NOT re-executed during validation phase, phantom reads are
	// not detected. That is, other committed transactions may have updated
	// the key concurrently, impacting the result set, and this would not be
	// detected at validation/commit time. Applications susceptible to this
	// should therefore not use GetHistoryForKey as part of transactions that
	// update ledger, and should limit use to read-only chaincode operations.
	GetHistoryForKey(key string) (HistoryQueryIteratorInterface, error)

	// GetCreator returns `SignatureHeader.Creator` (e.g. an identity)
	// of the `SignedProposal`. This is the identity of the agent (or user)
	// submitting the transaction.
	GetCreator() ([]byte, error)

	// GetTransient returns the `ChaincodeProposalPayload.Transient` field.
	// It is a map that contains data (e.g. cryptographic material)
	// that might be used to implement some form of application-level
	// confidentiality. The contents of this field, as prescribed by
	// `ChaincodeProposalPayload`, are supposed to always
	// be omitted from the transaction and excluded from the ledger.
	GetTransient() (map[string][]byte, error)

	// GetBinding returns the transaction binding
	GetBinding() ([]byte, error)

	// GetSignedProposal returns the SignedProposal object, which contains all
	// data elements part of a transaction proposal.
	GetSignedProposal() (*pb.SignedProposal, error)

	// GetTxTimestamp returns the timestamp when the transaction was created. This
	// is taken from the transaction ChannelHeader, therefore it will indicate the
	// client's timestamp, and will have the same value across all endorsers.
	GetTxTimestamp() (*timestamp.Timestamp, error)

	// SetEvent allows the chaincode to propose an event on the transaction
	// proposal. If the transaction is validated and successfully committed,
	// the event will be delivered to the current event listeners.
	SetEvent(name string, payload []byte) error
}

```